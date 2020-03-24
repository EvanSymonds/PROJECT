const Pool = require("pg").Pool;
const fsExtra = require('fs-extra');
const fs = require('fs');
const pool = new Pool({
  user: "evan",
  host: "localhost",
  database: "project",
  password: "Ebanisia5p",
  port: "5432",
});

const getFiles = (request, response) => {

  pool.query("SELECT * FROM files ORDER BY id ASC", async(error, results) => {
    if (error) {
      throw error;
    }
    var file;
  
    var files = [];

    for(i = 0; i < results.rows.length; i++){
      file = results.rows[i];
      await getAllFiles(file).then((data) => {
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
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM files WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    var file = results.rows;
    pool.query("SELECT lo_get($1)", [file[0].file_id], (error, results) => {
      if (error){
        throw error;
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
  img_name = request.files.file.name;
  file_type = img_name.split(".");
  file_type = file_type[file_type.length - 1];
  project_id = request.body.project_id;

  path = (__dirname + "/" + request.files.file.tempFilePath).replace(/\\/g, "/");

  await getFileContents(path).then((data) => {
    pool.query("INSERT INTO files (file_id, file_type, img_name, project_id) VALUES (lo_from_bytea(0, $1), $2, $3, $4)", [data, file_type, img_name, project_id], (error, results) => {
      if (error) {
        throw error;
      } else{
        fsExtra.emptyDirSync("./Temp_storage");
        response.status(200).json(results);
      }
    })
  })
  .catch((error) => {
    throw error;
  })

}

const deleteFile = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM files WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results);
  })
}

function getFileContents(path){
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (data == null){
        reject(new Error({error: "File failed to upload"}));
      } else {
        resolve(data);
      }
    })
  })
}

function getAllFiles(file){
  return new Promise((resolve, reject) => {
    pool.query("SELECT lo_get($1)", [file.file_id], (error, fileData) => {
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