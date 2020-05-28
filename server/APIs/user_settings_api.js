//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;
const pool = new Pool({
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.db_password"),
  port: config.get("database.port"),
});

//fs and fsExtra allow express to work with the temporary file and directory
const fsExtra = require('fs-extra');
const fs = require('fs');

const getUserSettings = (user_id) => {

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM user_settings WHERE user_id = $1", [user_id], (error, settings) => {
      if (error) {
        dbDebugger(error)
        reject(error)
      } else {
        resolve(settings)
      }
    })
  })
}

const createUserSettings = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO user_settings (user_id, theme) VALUES ($1, 'redGreyTheme')", [user_id], (error, results) => {
      if (error) {
        dbDebugger(error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

const updateUserSettings = (user_id, theme) => {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE user_settings SET theme=$2 WHERE user_id=$1", [user_id, theme], (error, results) => {
      if (error) {
        dbDebugger(error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

const deleteUserSettings = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM user_settings WHERE user_id = $1", [user_id], (error, results) => {
      if (error) {
        dbDebugger(error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

module.exports = {
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  deleteUserSettings
}