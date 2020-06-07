//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

const path = require("path")

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getFiles = () => {
  //Gets all files from the files table
  
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM files ORDER BY file_id ASC")
      .then(async(results) =>{
        dbDebugger("Files retrieved");

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
        resolve(files)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const getFileInfoByProject = (project_id) => {
  //Gets all files from the files table
  
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM files WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Files retrieved");
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end)
  })
}

const getFileInfoById = (file_id) => {
  //Gets all files from the files table
  
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM files WHERE file_id = $1", [file_id])
      .then((results) => {
        dbDebugger("Files retrieved");
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end)
  })
}

const getFileById = (file_id) => {
  //Gets a single file from the files table

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM files WHERE file_id = $1", [file_id])
      .then((results) => {
        var file = results.rows;

        pool.query("SELECT lo_get($1)", [file[0].file_data_id])
          .then(async(results) => {
            const data = (results.rows[0].lo_get);
  
            const file_path = path.join(__dirname, "..", "tmp", file[0].file_name)
            fs.writeFile(file_path, data, () => {
              resolve(file)
            })
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            reject(error)
            pool.end()
          })
          .then(() => pool.end())
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
  })
}

const storeFile = async (data, file_name, project_id) => {
  //Stores a file in the files table

  return new Promise( async (resolve, reject) => {

    file_type = file_name.split(".");
    file_type = file_type[file_type.length - 1].toLowerCase();
    
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO files (file_data_id, file_type, file_name, project_id) VALUES (lo_from_bytea(0, $1), $2, $3, $4) RETURNING file_id", [data, file_type, file_name, project_id])
      .then((results) => {
        dbDebugger("File uploaded to database")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const deleteFile = (file_id) => {
  //Deletes a file from the files table

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM files WHERE file_id = $1", [file_id])
      .then((results) => {
        dbDebugger("File deleted");
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const deleteFilesByProject = (project_id) => {
  //Deletes a file from the files table

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM files WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("File deleted");
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

function getFileData(file){
  //Gets just the data of a single file

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT lo_get($1)", [file.file_data_id])
      .then((fileData) => {
        resolve(fileData.rows[0].lo_get);
      })
      .catch((error) =>{
        dbDebugger("Error: ", error)
        reject(error);
        pool.end()
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getFiles,
  getFileById,
  getFileInfoByProject,
  getFileInfoById,
  storeFile,
  deleteFile,
  deleteFilesByProject
}