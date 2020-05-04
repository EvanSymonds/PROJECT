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

const getFoldersByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM folders WHERE project_id = $1", [project_id], (error, folders) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folders retrieved")
        resolve(folders)
      }
    })
  })
}

const getFolderById = (folder_id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM folders WHERE folder_id = $1", [folder_id], (error, folders) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folders retrieved")
        resolve(folders)
      }
    })
  })
}

const createFolder = (project_id) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO folders (project_id) VALUES ($1) RETURNING folder_id", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folder created")
        resolve(results)
      }
    })
  })
}

const renameFolder = (folder_id, new_name) => {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE folders SET folder_name = $2 where folder_id = $1", [folder_id, new_name], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folder renamed")
        resolve(results)
      }
    })
  })
}

const deleteFolder = (folder_id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM folders WHERE folder_id = $1", [folder_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folder deleted")
        resolve(results)
      }
    })
  })
}

const deleteFoldersByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM folders WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Folder deleted")
        resolve(results)
      }
    })
  })
}

module.exports = {
  getFoldersByProject,
  getFolderById,
  createFolder,
  renameFolder,
  deleteFolder,
  deleteFoldersByProject
}