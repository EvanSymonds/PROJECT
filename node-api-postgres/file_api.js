//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;
const pool = new Pool({
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.password"),
  port: config.get("database.port"),
});

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getFiles = (request, response) => {
  //Gets all files from the files table
  
  pool.query("SELECT * FROM files ORDER BY file_id ASC", async(error, results) => {
    if (error) {
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("Files retrieved");
    }
    
    var file;
    var files = [];

    for(i = 0; i < results.rows.length; i++){
      file = results.rows[i];

      await getFileData(file).then((data) => {
        files.push({
          file,
          data
        });
      })

    }
    response.status(200).json(files);
  })
}

const getFileById = (request, response) => {
  //Gets a single file from the files table

  const file_id = parseInt(request.params.id);

  pool.query("SELECT * FROM files WHERE file_id = $1", [file_id], (error, results) => {
    if (error) {
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("File retrieved");
    }

    var file = results.rows;

    pool.query("SELECT lo_get($1)", [file[0].file_data_id], (error, results) => {
      if (error){
        dbDebugger("Error: ", error);
      } else {
        dbDebugger("File data retrieved");
      }

      var data = (results.rows[0].lo_get);

      response.status(200).json({
        file,
        data
      });
    })
  })
}

const storeFile = async (request, response) => {
  //Stores a file in the files table

  if(!request.files)
  {
      response.status(400).send("File was not found");
  }

  img_name = request.files.file.name;
  file_type = img_name.split(".");
  file_type = file_type[file_type.length - 1];
  project_id = request.body.project_id;

  path = (__dirname + "/" + request.files.file.tempFilePath).replace(/\\/g, "/");

  await getFileContents(path).then((data) => {
    pool.query("INSERT INTO files (file_data_id, file_type, img_name, project_id) VALUES (lo_from_bytea(0, $1), $2, $3, $4)", [data, file_type, img_name, project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
      } else{
        dbDebugger("File uploaded to database")
        fsExtra.emptyDirSync("./Temp_storage");
        response.status(200).json(results);
      }
    })
  })
  .catch((error) => {
    fsDebugger("Error: ", error)
  })

}

const deleteFile = (request, response) => {
  //Deletes a file from the files table

  const file_id = parseInt(request.params.id);

  pool.query("DELETE FROM files WHERE file_id = $1", [file_id], (error, results) => {
    if (error) {
      dbDebugger("Error: ", error);
    } else{
      dbDebugger("File deleted");
    }
    response.status(200).json(results);
  })
}

function getFileContents(path){
  //Reads the contents of the temporary file

  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (data == null){
        reject(new Error({error: "File failed to upload"}));
      } else {
        fsDebugger("File uploaded to temporary storage")
        resolve(data);
      }
    })
  })
}

function getFileData(file){
  //Gets just the data of a single file

  return new Promise((resolve, reject) => {
    pool.query("SELECT lo_get($1)", [file.file_data_id], (error, fileData) => {
      if (error){
        reject(error);
      }
      resolve(fileData.rows[0].lo_get);
    })
  })
}

module.exports = {
  getFiles,
  getFileById,
  storeFile,
  deleteFile
}