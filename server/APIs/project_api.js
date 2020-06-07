//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

const getProjects = () => {
  //Gets all projects

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM projects ORDER BY project_id ASC")
      .then((results) => {
        dbDebugger("Retrieved all projects");
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const getProjectById = (project_id) => {
  //Gets a project from an ID

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM projects WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Project retrieved");
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const createProject = (project_name, is_public) => {
  //Creates a project

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO projects (project_name, is_public, created_on) VALUES ($1, $2, NOW()) RETURNING project_id", [project_name, is_public])
      .then((results) => {
        dbDebugger("Project created");
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const updateProject = (project_id, project_name, is_public) => {
  //Updates the project information

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE projects SET project_name = $2, is_public = $3 WHERE project_id = $1", [project_id, project_name, is_public])
      .then((results) => {
        dbDebugger("Project updated");
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const deleteProject = (project_id) => {
  //Deleted a project

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM projects WHERE project_id = $1", [project_id])
      .then((results) => {
        dbDebugger("Project deleted");
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
}