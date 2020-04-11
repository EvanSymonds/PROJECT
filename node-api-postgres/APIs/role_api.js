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
  password: config.get("database.db_password"),
  port: config.get("database.port"),
});

const getRoles = () => {
  //Gets all of the roles

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles ORDER BY project_id ASC", (error, roles) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Retrieved all roles");
        resolve(roles.rows);
      }
    })
  })
}

const getRolesByProject = (project_id) => {
  //Gets all of the roles from a project

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE project_id = $1", [project_id], (error, roles) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Retrieved all roles");
        resolve(roles.rows);
      }
    })
  })
}

const getRolesByUser = (user_id) => {
  //Gets all of the roles that a user has

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE user_id = $1", [user_id], (error, roles) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Retrieved all roles");
        resolve(roles.rows);
      }
    })
  })
}

const createRole = (project_id, role_name, user_id) => {
  //Creates a role relation between a user and a project

  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO project_roles (project_id, role_name, user_id) VALUES ($1, $2, $3)", [project_id, role_name, user_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Role created");
        resolve(results);
      }
    })
  })
}

const updateRole = (project_id, role_name, user_id, new_name) => {
  //Changes the name of a role

  return new Promise((resolve, reject) => {
    pool.query("UPDATE project_roles SET role_name = $1 WHERE project_id = $2 AND user_id = $3 AND role_name = $4", [new_name, project_id, user_id, role_name], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Role updated");
        resolve(results);
      }
    })
  })
}

const deleteRole = (project_id, role_name, user_id) => {
  //Deletes a role relation

  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM project_roles WHERE project_id = $1 AND role_name = $2 AND user_id = $3", [project_id, role_name, user_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("Role deleted");
        resolve(results);
      }
    })
  })
}

module.exports = {
  getRoles,
  getRolesByProject,
  getRolesByUser,
  createRole,
  updateRole,
  deleteRole
}