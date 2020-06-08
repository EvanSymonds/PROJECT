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

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM user_settings WHERE user_id = $1", [user_id])
      .then((settings) => {
        dbDebugger("Settings recieved")
        connection.release()
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const createUserSettings = (user_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();
    connection.query("INSERT INTO user_settings (user_id, theme) VALUES ($1, 'darkModeTheme')", [user_id])
      .then((settings) => {
        dbDebugger("Settings created")
        connection.release()
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const updateUserSettings = (user_id, theme) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("UPDATE user_settings SET theme=$2 WHERE user_id=$1", [user_id, theme])
      .then((results) => {
        dbDebugger("Settings updated")
        connection.release()
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const deleteUserSettings = (user_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("DELETE FROM user_settings WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("Settings deleted")
        connection.release()
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

module.exports = {
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  deleteUserSettings
}