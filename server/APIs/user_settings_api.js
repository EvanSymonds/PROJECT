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

const getUserSettings = (user_id) => {
  return new Promise( async(resolve, reject) => {

    console.log("Pre connection")
    pool
      .connect()
      .then((client) => {
        console.log("Connected")
        client
          .query("SELECT * FROM user_settings WHERE user_id = $1", [user_id])
          .then((settings) => {
            dbDebugger("Settings recieved")
            client.release()
            resolve(settings)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
    
    })
}

const createUserSettings = (user_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO user_settings (user_id, theme) VALUES ($1, 'darkModeTheme')", [user_id])
          .then((settings) => {
            dbDebugger("Settings created")
            client.release()
            resolve(settings)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const updateUserSettings = (user_id, theme) => {

  return new Promise(async(resolve, reject) => {

    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE user_settings SET theme=$2 WHERE user_id=$1", [user_id, theme])
          .then((results) => {
            dbDebugger("Settings updated")
            client.release()
            resolve(settings)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteUserSettings = (user_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM user_settings WHERE user_id = $1", [user_id])
          .then((results) => {
            dbDebugger("Settings deleted")
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

module.exports = {
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  deleteUserSettings
}