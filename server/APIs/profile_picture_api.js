//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;
const pool = new Pool({
  poolSize: 5,
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.db_password"),
  port: config.get("database.port"),
});
pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getProfilePictureByUser = (user_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM profile_pictures WHERE user_id = $1", [user_id])
      .then((results) => {
        var profile_picture = results.rows;

        if (profile_picture.length === 0) {
          reject("Profile picture not found")
        } else {
          connection.query("SELECT lo_get($1)", [profile_picture[0].profile_picture_data_id])
            .then((results) => {
              const data = (results.rows[0].lo_get);

              const path = "./Temp_storage/" + profile_picture[0].user_id
              fs.writeFile(path, data, () => {
                connection.release()
                resolve({
                  profile_picture,
                  data,
                  path
                })
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

const storeProfilePicture = async (data, user_id) => {

  return new Promise( async (resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM profile_pictures WHERE user_id = $1", [user_id])
      .then((results) => {
        if (results.rows.length > 0) {
          connection.query("UPDATE profile_pictures SET profile_picture_data_id = (lo_from_bytea(0, $1)) WHERE user_id = $2", [data, user_id])
            .then((results) => {
              dbDebugger("Profile picture uploaded to database")
              connection.release()
              resolve(results)
            })
            .catch((error) => {
              dbDebugger("Error: ", error);
              reject(error)
            })
        } else {
          connection.query("INSERT INTO profile_pictures (profile_picture_data_id, user_id) VALUES (lo_from_bytea(0, $1), $2)", [data, user_id])
            .then((results) => {
              dbDebugger("Profile picture uploaded to database")
              connection.release()
              resolve(results)
            })
            .catch((error) => {
              dbDebugger("Error: ", error);
              reject(error)
            })
        }
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const deleteProfilePicture = async(user_id) => {

  return new Promise( async (resolve, reject) => {
    const connection = await pool.connect();

    connection.query("DELETE FROM profile_pictures WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("Profile picture deleted")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

module.exports = {
  getProfilePictureByUser,
  storeProfilePicture,
  deleteProfilePicture
}