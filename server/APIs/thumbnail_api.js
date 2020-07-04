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
    const connection = await pool.connect();

    connection.query("SELECT * FROM thumbnails WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Thumbnail retrieved");

        var thumbnail = results.rows;

        if (thumbnail.length === 0) {
          resolve(null)
        } else {
          connection.query("SELECT lo_get($1)", [thumbnail[0].thumbnail_data_id])
            .then((results) => {
              connection.release()
              const data = (results.rows[0].lo_get);
    
              resolve({
                thumbnail,
                data,
              })
            })
            .catch((error) => {
              dbDebugger("Error: ", error);
              reject(error)
            })
        }
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
      })
  })
}

const storeThumbnail = async (data, project_id) => {

  return new Promise( async (resolve, reject) => {
    const connection = await pool.connect();

      connection.query("INSERT INTO thumbnails (thumbnail_data_id, project_id) VALUES (lo_from_bytea(0, $1), $2)", [data, project_id])
        .then((results) => {
          dbDebugger("Thumbnail uploaded to database")
          connection.release()
          resolve(results)
        })
        .catch((error) => {
          dbDebugger("Error: ", error);
          reject(error)
        })
  })
}

const deleteThumbnail = async(project_id) => {

  return new Promise( async (resolve, reject) => {
    const connection = await pool.connect();

    connection.query("DELETE FROM thumbnails WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Thumbnail deleted")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
      })
  })
}

module.exports = {
  getThumbnailByProject,
  storeThumbnail,
  deleteThumbnail
}