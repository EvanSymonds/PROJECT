//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js");
const { resolve } = require("path");

const getRoles = () => {
  //Gets all of the roles

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles ORDER BY project_id ASC ORDER BY authorisation_level DESC")
          .then((roles) => {
            dbDebugger("Retrieved all roles");
            client.release()
            resolve(roles.rows);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getRolesByProject = (project_id) => {
  //Gets all of the roles from a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE project_id = $1 ORDER BY authorisation_level DESC", [project_id])
          .then((roles) => {
            dbDebugger("Retrieved all roles");
            client.release()
            resolve(roles.rows);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getRolesByUser = (user_id) => {
  //Gets all of the roles that a user has

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE user_id = $1 ORDER BY authorisation_level DESC", [user_id])
          .then((roles) => {
            dbDebugger("Retrieved all roles")
            client.release()
            resolve(roles.rows)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getRolesById = (role_id) => {
  //Gets all of the roles from a role ID

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE role_id = $1 ORDER BY authorisation_level DESC", [role_id])
          .then((roles) => {
            dbDebugger("Retrieved all roles")
            client.release()
            resolve(roles.rows)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getRolesByName = (role_name) => {
  //Gets all the roles with a certain name

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE role_name = $1 ORDER BY authorisation_level DESC", [role_name])
          .then((roles) => {
            dbDebugger("Retrieved all roles")
            client.release()
            resolve(roles.rows)
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const assignRole = (project_id, role_name, user_id) => {
  //Creates a role relation between a user and a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE project_id = $1", [project_id])
          .then((results) => {
            const targetRoles = results.rows.filter((role) => role.role_name === role_name)
    
            const auth_level = targetRoles[0].authorisation_level
    
            client
              .query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, $2, $3, $4)", [project_id, role_name, user_id, auth_level])
              .then((results) => {
                dbDebugger("Role created");
                client.release()
                resolve(results);
              })
              .catch((error) => {
                console.log(error)
                client.release()
                reject(error)
              })
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const inviteUser = (project_id, user_id) => {
  //Creates a role relation between a user and a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, 'INVITED', $2, -1)", [project_id, user_id])
          .then((results) => {
            dbDebugger("User invited");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const createRole = (project_id, role_name) => {
  //Creates an empty role in an a project

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client.query("SELECT * FROM project_roles WHERE project_id = $1", [project_id])
        .then((results) => {
          const auth_level = results.rows.length === 0 ? 9 : 1
  
          client
            .query("SELECT * FROM project_roles WHERE project_id = $1 AND role_name = $2", [project_id, role_name])
            .then((results) => {
              if (results.rows.length > 0) {
                reject("ROLE ALREADY EXISTS WITH THAT NAME")
              } else {

                client
                  .query("INSERT INTO project_roles (project_id, role_name, user_id, authorisation_level) VALUES ($1, $2, -1, $3)", [project_id, role_name, auth_level])
                  .then((results) => {
                    dbDebugger("Role created");
                    client.release()
                    resolve(results);
                  })
                  .catch((error) => {
                    console.log(error)
                    client.release()
                    reject(error)
                  })
              }
            })
            .catch((error) => {
              console.log(error)
              client.release()
              reject(error)
            })
        })
        .catch((error) => {
          console.log(error)
          client.release()
          reject(error)
        })
      })
  })
}

const renameRole = (role_id, new_name) => {
  //Changes the name of a role

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE project_roles SET role_name = $1 WHERE role_id = $2", [new_name, role_id])
          .then((results) => {
            dbDebugger("Role updated");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const changeRole = (role_id, new_role, project_id) => {
  //Changes the role of a user

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM project_roles WHERE project_id = $1", [project_id])
          .then((results) => {
            const targetRole = results.rows.filter((role) => role.role_name === new_role)
    
            const auth_level = targetRole[0].authorisation_level
    
            client
              .query("UPDATE project_roles SET role_name = $1, authorisation_level = $2 WHERE role_id = $3", [new_role, auth_level, role_id])
              .then((results) => {
                dbDebugger("Role updated")
                client.release()
                resolve(results)
              })
              .catch((error) => {
                console.log(error)
                client.release()
                reject(error)
              })
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const updateRoleAuth = (role_name, project_id, auth_level) => {
  //Changes the name of a role

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE project_roles SET authorisation_level = $1 WHERE role_name = $2 AND project_id = $3", [auth_level, role_name, project_id])
          .then((results) => {
            dbDebugger("Role updated");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteRole = (role_name, project_id) => {
  //Deletes a role
  
  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM project_roles WHERE role_name = $1 AND project_id = $2", [role_name, project_id])
          .then((results) => {
            dbDebugger("Role deleted")
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

const deleteUserRole = (role_id, project_id) => {
  //Deletes a role

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()

      .then((client) => {
        client
          .query("DELETE FROM project_roles WHERE role_id = $1 AND project_id = $2", [role_id, project_id])
          .then((results) => {
            dbDebugger("Role deleted");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteRolesByProject = (project_id) => {

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM project_roles WHERE project_id = $1", [project_id])
          .then((results) => {
            dbDebugger("Roles deleted")
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
  getRoles,
  getRolesByProject,
  getRolesByUser,
  getRolesById,
  getRolesByName,
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