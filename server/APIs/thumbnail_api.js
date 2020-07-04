//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getThumbnailByProject = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM thumbnails WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Thumbnail retrieved");
    
            var thumbnail = results.rows;
    
            if (thumbnail.length === 0) {
              resolve(null)
            } else {

              client
                .query("SELECT lo_get($1)", [thumbnail[0].thumbnail_data_id])
                .then((results) => {
                  const data = (results.rows[0].lo_get);
        
                  client.release()
                  resolve({
                    thumbnail,
                    data,
                  })
                })
                .catch((error) => {
                  dbDebugger("Error: ", error);
                  client.release()
                  reject(error)
                })
            }
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error)
          })
      })
  })
}

const storeThumbnail = async (data, project_id) => {

  return new Promise( async (resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO thumbnails (thumbnail_data_id, project_id) VALUES (lo_from_bytea(0, $1), $2)", [data, project_id])
          .then((results) => {
            dbDebugger("Thumbnail uploaded to database")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error)
          })
      })
  })
}

const deleteThumbnail = async(project_id) => {

  return new Promise( async (resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM thumbnails WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Thumbnail deleted")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error)
          })
      })
  })
}

module.exports = {
  getThumbnailByProject,
  storeThumbnail,
  deleteThumbnail
}