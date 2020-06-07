//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

const getSettingsByProject = async(project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM project_settings WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Settings received")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const createProjectSettings = async (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO project_settings (project_id)VALUES ($1)", [project_id])
      .then((results) => {
        dbDebugger("Settings created")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const changeSettingsAuth = async (project_id, new_value) => {
  dbDebugger(project_id, new_value)

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE project_settings SET change_settings_auth = $2 WHERE project_id = $1", [project_id, new_value])
      .then((results) => {
        dbDebugger("Setting updated")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const editFilesAuth = async (project_id, new_value) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE project_settings SET edit_files_auth = $2 WHERE project_id = $1", [project_id, new_value])
      .then((results) => {
        dbDebugger("Setting updated")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const deleteProjectSettings = async (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM project_settings WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Settings deleted")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getSettingsByProject,
  createProjectSettings,
  changeSettingsAuth,
  editFilesAuth,
  deleteProjectSettings,
}