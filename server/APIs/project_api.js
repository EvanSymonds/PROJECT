//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

const getProjects = () => {
  //Gets all projects

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM projects ORDER BY project_id ASC")
          .then((results) => {
            dbDebugger("Retrieved all projects");
            client.release()
            resolve(results.rows);
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error);
          })
      })
  })
}

const getProjectById = (project_id) => {
  //Gets a project from an ID

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
        .then((client) => {
          client
            .query("SELECT * FROM projects WHERE project_id = $1", [project_id])
            .then((results) => {
              dbDebugger("Project retrieved");
              client.release()
              resolve(results.rows);
            })
            .catch((error) => {
              dbDebugger("Error: ", error);
              client.release()
              reject(error);
            })
        })
  })
}

const createProject = (project_name, is_public) => {
  //Creates a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO projects (project_name, is_public, created_on) VALUES ($1, $2, NOW()) RETURNING project_id", [project_name, is_public])
          .then((results) => {
            dbDebugger("Project created");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error);
          })
      })
  })
}

const updateProject = (project_id, project_name, is_public) => {
  //Updates the project information

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE projects SET project_name = $2, is_public = $3 WHERE project_id = $1", [project_id, project_name, is_public])
          .then((results) => {
            dbDebugger("Project updated");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error);
          })
      })
  })
}

const deleteProject = (project_id) => {
  //Deleted a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM projects WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Project deleted");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            dbDebugger("Error: ", error);
            client.release()
            reject(error);
          })
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