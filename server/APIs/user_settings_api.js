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

const getUserSettings = (user_id) => {

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM user_settings WHERE user_id = $1", [user_id])
      .then((settings) => {
        dbDebugger("Settings recieved")
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const createUserSettings = (user_id) => {

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO user_settings (user_id, theme) VALUES ($1, 'redGreyTheme')", [user_id])
      .then((settings) => {
        dbDebugger("Settings created")
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const updateUserSettings = (user_id, theme) => {

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE user_settings SET theme=$2 WHERE user_id=$1", [user_id, theme])
      .then((results) => {
        dbDebugger("Settings updated")
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const deleteUserSettings = (user_id) => {

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM user_settings WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("Settings deleted")
        resolve(settings)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  deleteUserSettings
}