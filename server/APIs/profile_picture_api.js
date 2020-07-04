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

const getProfilePictureByUser = (user_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM profile_pictures WHERE user_id = $1", [user_id])
          .then((results) => {
            var profile_picture = results.rows;
    
            if (profile_picture.length === 0) {
              client.release()
              resolve(null)
            } else {

              client
                .query("SELECT lo_get($1)", [profile_picture[0].profile_picture_data_id])
                .then((results) => {
                  const data = (results.rows[0].lo_get);
    
                  client.release()
                  resolve({
                    profile_picture,
                    data,
                  })
                })
                .catch((error) => {
                  console.log(error)
                  client.release()
                  reject(error)
                })

            }
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const storeProfilePicture = async (data, user_id) => {

  return new Promise( async (resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM profile_pictures WHERE user_id = $1", [user_id])
          .then((results) => {
            if (results.rows.length > 0) {
              client
                .query("UPDATE profile_pictures SET profile_picture_data_id = (lo_from_bytea(0, $1)) WHERE user_id = $2", [data, user_id])
                  .then((results) => {
                    dbDebugger("Profile picture uploaded to database")
                    client.release()
                    resolve(results)
                  })
                  .catch((error) => {
                    dbDebugger("Error: ", error);
                    client.release()
                    reject(error)
                  })
            } else {
              client
                .query("INSERT INTO profile_pictures (profile_picture_data_id, user_id) VALUES (lo_from_bytea(0, $1), $2)", [data, user_id])
                .then((results) => {
                  dbDebugger("Profile picture uploaded to database")
                  client.release()
                  resolve(results)
                })
                .catch((error) => {
                  dbDebugger("Error: ", error);
                  client.release()
                  reject(error)
                })
            }
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteProfilePicture = async(user_id) => {

  return new Promise( async (resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM profile_pictures WHERE user_id = $1", [user_id])
          .then((results) => {
            dbDebugger("Profile picture deleted")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

module.exports = {
  getProfilePictureByUser,
  storeProfilePicture,
  deleteProfilePicture
}