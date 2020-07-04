//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

const path = require("path")

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getFiles = () => {
  //Gets all files from the files table
  
  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM files ORDER BY file_id ASC")
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
            client.release()
            resolve(files)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFileInfoByProject = (project_id) => {
  //Gets all files from the files table
  
  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM files WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Files retrieved");
            client.release()
            resolve(results)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFileInfoById = (file_id) => {
  //Gets all files from the files table
  
  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM files WHERE file_id = $1", [file_id])
          .then((results) => {
            dbDebugger("Files retrieved");
            client.release()
            resolve(results)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFileById = (file_id) => {
  //Gets a single file from the files table

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
        .query("SELECT * FROM files WHERE file_id = $1", [file_id])
        .then((results) => {

          var file = results.rows;
  
          pool.query("SELECT lo_get($1)", [file[0].file_data_id])
            .then(async(results) => {
              const data = (results.rows[0].lo_get);
    
              client.release()
              resolve({file_name: file[0].file_name, data: data})
            })
            .catch((error) => {
              console.log(error)
              client.release()
              reject(error)
            })
        })
        .catch((error) => {
          console.log(error)
          client.release()
          reject(error)
        })
      })
  })
}

const storeFile = async (data, file_name, project_id) => {
  //Stores a file in the files table

  return new Promise( async (resolve, reject) => {

    file_type = file_name.split(".");
    file_type = file_type[file_type.length - 1].toLowerCase();
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO files (file_data_id, file_type, file_name, project_id) VALUES (lo_from_bytea(0, $1), $2, $3, $4) RETURNING file_id", [data, file_type, file_name, project_id])
          .then((results) => {
            dbDebugger("File uploaded to database")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })

  })
}

const deleteFile = (file_id) => {
  //Deletes a file from the files table

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM files WHERE file_id = $1", [file_id])
          .then((results) => {
            dbDebugger("File deleted");
            client.release()
            resolve(results)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })

  })
}

const deleteFilesByProject = (project_id) => {
  //Deletes a file from the files table

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM files WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("File deleted");
            client.release()
            resolve(results)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

function getFileData(file){
  //Gets just the data of a single file

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT lo_get($1)", [file.file_data_id])
          .then((fileData) => {
            client.release()
            resolve(fileData.rows[0].lo_get);
          })
          .catch((error) =>{
            console.log(error)
            client.release()
            reject(error);
          })
      })
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