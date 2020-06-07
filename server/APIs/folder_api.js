//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

const getFoldersByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM folders WHERE project_id = $1", [project_id])
      .then((folders) => {
        dbDebugger("Folders retrieved")
        resolve(folders)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const getFolderById = (folder_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });
    
    pool.query("SELECT * FROM folders WHERE folder_id = $1", [folder_id])
      .then((folders) => {
        dbDebugger("Folders retrieved")
        resolve(folders)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const createFolder = (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO folders (project_id) VALUES ($1) RETURNING folder_id", [project_id])
      .then((results) => {
        dbDebugger("Folder created")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const renameFolder = (folder_id, new_name) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE folders SET folder_name = $2 where folder_id = $1", [folder_id, new_name])
      .then((results) => {
        dbDebugger("Folder renamed")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const changeFolderAuth = (folder_id, new_auth) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE folders SET authorisation_level = $2 where folder_id = $1", [folder_id, new_auth])
      .then((results) => {
        dbDebugger("Folder auth changed")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const changeFolderColor = (folder_id, folder_color) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE folders SET folder_color = $2 where folder_id = $1", [folder_id, folder_color])
      .then((results) => {
        dbDebugger("Folder auth changed")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const deleteFolder = (folder_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM folders WHERE folder_id = $1", [folder_id])
      .then((results) => {
        dbDebugger("Folder deleted")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

const deleteFoldersByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM folders WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Folder deleted")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
        pool.end()
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getFoldersByProject,
  getFolderById,
  createFolder,
  renameFolder,
  changeFolderAuth,
  changeFolderColor,
  deleteFolder,
  deleteFoldersByProject
}