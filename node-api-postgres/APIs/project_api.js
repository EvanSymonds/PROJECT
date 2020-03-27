//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;
const pool = new Pool({
  user: config.get("database.user"),
  host: config.get("database.host"),
  database: config.get("database.database"),
  password: config.get("database.password"),
  port: config.get("database.port"),
});

const getProjects = () => {
  //Gets all projects

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM projects ORDER BY project_id ASC", (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Retrieved all projects");
        resolve(results.rows);
      }
    })
  })
}

const getProjectById = (project_id) => {
  //Gets a project from an ID

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM projects WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Project retrieved");
        resolve(results.rows);
      }
    })
  })
}

const createProject = (project_name, is_public) => {
  //Creates a project

  debug(project_name, is_public);
  
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO projects (project_name, is_public, created_on) VALUES ($1, $2, NOW())", [project_name, is_public], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Project created");
        resolve(results);
      }
    })
  })
}

const updateProject = (project_id, project_name, is_public) => {
  //Updates the project information

  debug(project_id, project_name, is_public);

  return new Promise((resolve, reject) => {
    pool.query("UPDATE projects SET project_name = $2, is_public = $3 WHERE project_id = $1", [project_id, project_name, is_public], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Project updated");
        resolve(results);
      }
    })
  })
}

const deleteProject = (project_id) => {
  //Deleted a project

  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM projects WHERE project_id = $1", [project_id] ,(error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Project deleted");
        resolve(results);
      }
    })
  })
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
}