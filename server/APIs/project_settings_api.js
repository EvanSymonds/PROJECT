//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

const getSettingsByProject = async(project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_settings WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Settings received")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger(error)
            client.release()
            reject(error)
          })
      })
  })
}

const createProjectSettings = async (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO project_settings (project_id)VALUES ($1)", [project_id])
          .then((results) => {
            dbDebugger("Settings created")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger(error)
            client.release()
            reject(error)
          })
      })
  })
}

const changeSettingsAuth = async (project_id, new_value) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE project_settings SET change_settings_auth = $2 WHERE project_id = $1", [project_id, new_value])
          .then((results) => {
            dbDebugger("Setting updated")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger(error)
            client.release()
            reject(error)
          })
      })
  })
}

const editFilesAuth = async (project_id, new_value) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE project_settings SET edit_files_auth = $2 WHERE project_id = $1", [project_id, new_value])
          .then((results) => {
            dbDebugger("Setting updated")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger(error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteProjectSettings = async (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM project_settings WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Settings deleted")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger(error)
            client.release()
            reject(error)
          })
      })
  })
}

module.exports = {
  getSettingsByProject,
  createProjectSettings,
  changeSettingsAuth,
  editFilesAuth,
  deleteProjectSettings,
}