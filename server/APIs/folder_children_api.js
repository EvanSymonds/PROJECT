//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

const getRelationsByFolder = (folder_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM folder_children WHERE folder_id = $1", [folder_id])
          .then((relations) => {
            dbDebugger("Relations retrieved")
            client.release()
            resolve(relations)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getRelationsByChild = (child_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM folder_children WHERE child_id = $1", [child_id])
          .then((relations) => {
            dbDebugger("Relations retrieved")
            client.release()
            resolve(relations)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFolderFolders = (folder_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM folder_children WHERE folder_id = $1 AND child_type = 'folder'", [folder_id])
          .then((relations) => {
            dbDebugger("Relations retrieved")
            client.release()
            resolve(relations)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getFolderFiles = (folder_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM folder_children WHERE folder_id = $1 AND child_type = 'file'", [folder_id])
          .then((relations) => {
            dbDebugger("Relations retrieved")
            client.release()
            resolve(relations)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const createRelation = (folder_id, child_id, type) => {

  return new Promise(async(resolve, reject) => {
    if (type !== "folder" && type !== "file") {
      dbDebugger("Error: type is invalid. Must be 'folder' or 'file'")
      reject("Error: type is invalid. Must be 'folder' or 'file'")
    }

    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO folder_children (folder_id, child_id, child_type) VALUES ($1, $2, $3)", [folder_id, child_id, type])
          .then((results) => {
            dbDebugger("Relation created")
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

const updateRelation = (folder_id, child_id, type) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
        .then((client) => {
          client
            .query("UPDATE folder_children SET folder_id = $1 WHERE child_id = $2 AND child_type = $3", [folder_id, child_id, type])
            .then((results) => {
              dbDebugger("Relation updated")
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

const deleteRelation = (folder_id, child_id, type) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM folder_children WHERE folder_id = $1 AND child_id = $2 AND child_type = $3", [folder_id, child_id, type])
          .then((results) => {
            dbDebugger("Relation created")
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

const deleteRelationsByProject = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM folder_children WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Relation created")
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
  getRelationsByFolder,
  getRelationsByChild,
  getFolderFolders,
  getFolderFiles,
  createRelation,
  updateRelation,
  deleteRelation,
  deleteRelationsByProject
}