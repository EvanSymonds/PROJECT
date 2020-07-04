//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

const getFoldersByProject = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM folders WHERE project_id = $1", [project_id])
          .then((folders) => {
            dbDebugger("Folders retrieved")
            client.release()
            resolve(folders)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFolderById = (folder_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
    .connect()
    .then((client) => {
      client.query("SELECT * FROM folders WHERE folder_id = $1", [folder_id])
      .then((folders) => {
        dbDebugger("Folders retrieved")
        client.release()
        resolve(folders)
      })
      .catch((error) => {
        console.log(error)
        client.release()
        reject(error)
      })
    })
  })
}

const createFolder = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO folders (project_id) VALUES ($1) RETURNING folder_id", [project_id])
          .then((results) => {
            dbDebugger("Folder created")
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

const renameFolder = (folder_id, new_name) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE folders SET folder_name = $2 where folder_id = $1", [folder_id, new_name])
          .then((results) => {
            dbDebugger("Folder renamed")
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

const changeFolderAuth = (folder_id, new_auth) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE folders SET authorisation_level = $2 where folder_id = $1", [folder_id, new_auth])
          .then((results) => {
            dbDebugger("Folder auth changed")
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

const changeFolderColor = (folder_id, folder_color) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE folders SET folder_color = $2 where folder_id = $1", [folder_id, folder_color])
          .then((results) => {
            dbDebugger("Folder auth changed")
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

const deleteFolder = (folder_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM folders WHERE folder_id = $1", [folder_id])
          .then((results) => {
            dbDebugger("Folder deleted")
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

const deleteFoldersByProject = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM folders WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Folder deleted")
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
  getFoldersByProject,
  getFolderById,
  createFolder,
  renameFolder,
  changeFolderAuth,
  changeFolderColor,
  deleteFolder,
  deleteFoldersByProject
}