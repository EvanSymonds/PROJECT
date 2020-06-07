//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getThumbnailByProject = (project_id) => {

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM thumbnails WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Thumbnail retrieved");

        var thumbnail = results.rows;

        if (thumbnail.length === 0) {
          reject("No thumbnail")
        } else {
          pool.query("SELECT lo_get($1)", [thumbnail[0].thumbnail_data_id], async (error, results) => {
            if (error){
              dbDebugger("Error: ", error);
              reject(error)
            } else {
              dbDebugger("Thumbnail data retrieved");
            }
            const data = (results.rows[0].lo_get);
    
            const path = "./Temp_storage/" + thumbnail[0].project_id
            fs.writeFile(path, data, () => {
              resolve({
                thumbnail,
                data,
                path
              })
            })
          })
        }
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const storeThumbnail = async (data, project_id) => {

  return new Promise( async (resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

      pool.query("INSERT INTO thumbnails (thumbnail_data_id, project_id) VALUES (lo_from_bytea(0, $1), $2)", [data, project_id])
        .then((results) => {
          dbDebugger("Thumbnail uploaded to database")
          resolve(results)
        })
        .catch((error) => {
          dbDebugger("Error: ", error);
          reject(error)
        })
        .then(() => pool.end())
  })
}

const deleteThumbnail = async(project_id) => {

  return new Promise( async (resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM thumbnails WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Thumbnail deleted")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error)
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getThumbnailByProject,
  storeThumbnail,
  deleteThumbnail
}