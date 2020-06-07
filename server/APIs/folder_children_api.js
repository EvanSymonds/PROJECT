//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");


//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

const getRelationsByFolder = (folder_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM folder_children WHERE folder_id = $1", [folder_id])
      .then((relations) => {
        dbDebugger("Relations retrieved")
        resolve(relations)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const getRelationsByChild = (child_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM folder_children WHERE child_id = $1", [child_id])
      .then((relations) => {
        dbDebugger("Relations retrieved")
        resolve(relations)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const getFolderFolders = (folder_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM folder_children WHERE folder_id = $1 AND child_type = 'folder'", [folder_id])
      .then((relations) => {
        dbDebugger("Relations retrieved")
        resolve(relations)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const getFolderFiles = (folder_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM folder_children WHERE folder_id = $1 AND child_type = 'file'", [folder_id])
      .then((relations) => {
        dbDebugger("Relations retrieved")
        resolve(relations)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const createRelation = (folder_id, child_id, type) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    if (type !== "folder" && type !== "file") {
      dbDebugger("Error: type is invalid. Must be 'folder' or 'file'")
      reject("Error: type is invalid. Must be 'folder' or 'file'")
    }

    pool.query("INSERT INTO folder_children (folder_id, child_id, child_type) VALUES ($1, $2, $3)", [folder_id, child_id, type])
      .then((results) => {
        dbDebugger("Relation created")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const updateRelation = (folder_id, child_id, type) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE folder_children SET folder_id = $1 WHERE child_id = $2 AND child_type = $3", [folder_id, child_id, type])
      .then((results) => {
        dbDebugger("Relation updated")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const deleteRelation = (folder_id, child_id, type) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM folder_children WHERE folder_id = $1 AND child_id = $2 AND child_type = $3", [folder_id, child_id, type])
      .then((results) => {
        dbDebugger("Relation created")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
  })
}

const deleteRelationsByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM folder_children WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Relation created")
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
      .then(() => pool.end())
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