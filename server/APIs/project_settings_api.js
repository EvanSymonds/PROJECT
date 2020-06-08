//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;
const pool = new Pool({
  max: config.get("database.connection_limit"),
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.db_password"),
  port: config.get("database.port"),
});
pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

const getSettingsByProject = async(project_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM project_settings WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Settings received")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
      })
  })
}

const createProjectSettings = async (project_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("INSERT INTO project_settings (project_id)VALUES ($1)", [project_id])
      .then((results) => {
        dbDebugger("Settings created")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
      })
  })
}

const changeSettingsAuth = async (project_id, new_value) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("UPDATE project_settings SET change_settings_auth = $2 WHERE project_id = $1", [project_id, new_value])
      .then((results) => {
        dbDebugger("Setting updated")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
      })
  })
}

const editFilesAuth = async (project_id, new_value) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("UPDATE project_settings SET edit_files_auth = $2 WHERE project_id = $1", [project_id, new_value])
      .then((results) => {
        dbDebugger("Setting updated")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
      })
  })
}

const deleteProjectSettings = async (project_id) => {

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("DELETE FROM project_settings WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Settings deleted")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger(error)
        reject(error)
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