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
    pool.query("SELECT * FROM project_roles ORDER BY project_id ASC ORDER BY authorisation_level DESC", (error, roles) => {
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
    pool.query("SELECT * FROM project_roles WHERE project_id = $1 ORDER BY authorisation_level DESC", [project_id], (error, roles) => {
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
    pool.query("SELECT * FROM project_roles WHERE user_id = $1 ORDER BY authorisation_level DESC", [user_id], (error, roles) => {
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

const getRolesById = (role_id) => {
  //Gets all of the roles from a role ID

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE role_id = $1 ORDER BY authorisation_level DESC", [role_id], (error, roles) => {
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

const assignRole = (project_id, role_name, user_id) => {
  //Creates a role relation between a user and a project

  console.log(project_id, role_name, user_id)

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {

        const targetRoles = results.rows.filter((role) => role.role_name === role_name)

        const auth_level = targetRoles[0].authorisation_level

        pool.query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, $2, $3, $4)", [project_id, role_name, user_id, auth_level], (error, results) => {
          if (error) {
            dbDebugger("Error: ", error);
            reject(error);
          } else {
            dbDebugger("Role created");
            resolve(results);
          }
        })
      }
    })
  })
}

const inviteUser = (project_id, user_id) => {
  //Creates a role relation between a user and a project

  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, 'INVITED', $2, -1)", [project_id, user_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error);
        reject(error);
      } else {
        dbDebugger("UserInvited");
        resolve(results);
      }
    })
  })
}

const createRole = (project_id, role_name) => {
  //Creates an empty role in an a project

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        response.status(400).json(error)
      } else {
        const auth_level = results.rows.length === 0 ? 9 : 1

        pool.query("SELECT * FROM project_roles WHERE project_id = $1 AND role_name = $2", [project_id, role_name], (error, results) => {
          if (error) {
            dbDebugger("Error: ", error);
            reject(error);
          } else {
            if (results.rows.length > 0) {
              reject("ROLE ALREADY EXISTS WITH THAT NAME")
            } else {
              pool.query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, $2, -1, $3)", [project_id, role_name, auth_level], (error, results) => {
                if (error) {
                  dbDebugger("Error: ", error);
                  reject(error);
                } else {
                  dbDebugger("Role created");
                  resolve(results);
                }
              })
            }
          }
        })
      }
    })
  })
}

const renameRole = (role_id, new_name) => {
  //Changes the name of a role

  return new Promise((resolve, reject) => {
    pool.query("UPDATE project_roles SET role_name = $1 WHERE role_id = $2", [new_name, role_id], (error, results) => {
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

const changeRole = (role_id, new_role, project_id) => {
  //Changes the role of a user

  dbDebugger(new_role)

  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM project_roles WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        const targetRole = results.rows.filter((role) => role.role_name === new_role)

        dbDebugger(targetRole)

        const auth_level = targetRole[0].authorisation_level

        pool.query("UPDATE project_roles SET role_name = $1, authorisation_level = $2 WHERE role_id = $3", [new_role, auth_level, role_id], (error, results) => {
          if (error) {
            dbDebugger("Error: ", error);
            reject(error);
          } else {
            dbDebugger("Role updated");
            resolve(results);
          }
        })
      }
    })
  })
}

const updateRoleAuth = (role_name, project_id, auth_level) => {
  //Changes the name of a role

  return new Promise((resolve, reject) => {

    pool.query("UPDATE project_roles SET authorisation_level = $1 WHERE role_name = $2 AND project_id = $3", [auth_level, role_name, project_id], (error, results) => {
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

const deleteRole = (role_name, project_id) => {
  //Deletes a role
  
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM project_roles WHERE role_name = $1 AND project_id = $2", [role_name, project_id], (error, results) => {
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

const deleteUserRole = (role_id, project_id) => {
  //Deletes a role

  console.log(role_id, project_id)

  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM project_roles WHERE role_id = $1 AND project_id = $2", [role_id, project_id], (error, results) => {
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

const deleteRolesByProject = (project_id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM project_roles WHERE project_id = $1", [project_id], (error, results) => {
      if (error) {
        dbDebugger("Error: ", error)
        reject(error)
      } else {
        dbDebugger("Roles deleted")
        resolve(results)
      }
    })
  })
}

module.exports = {
  getRoles,
  getRolesByProject,
  getRolesByUser,
  getRolesById,
  assignRole,
  createRole,
  inviteUser,
  renameRole,
  changeRole,
  updateRoleAuth,
  deleteRole,
  deleteUserRole,
  deleteRolesByProject
}