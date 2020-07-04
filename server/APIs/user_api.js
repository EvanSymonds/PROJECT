//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const pool = require("../database.js")

const getUsers = () => {
  //Gets all users

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM users ORDER BY user_id ASC")
          .then((results) => {
            dbDebugger("Users retrieved");
            client.release()
            resolve(results.rows);
          })
          .catch((error) => {
            console.log(error)
            client.release()
            reject(error)
          })
      })
  })
}

const getUserById = (user_id) => {
  //Gets a single user from an ID

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM users WHERE user_id = $1", [user_id])
          .then((results) => {
            dbDebugger("User retrieved");
            client.release()
            resolve(results.rows);
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

const getUserByCredential = (value) => {
  //Gets a single user from a credential

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("SELECT * FROM users WHERE position($1 in LOWER(username)) > 0 OR LOWER(email) = $1", [value.toLowerCase()])
          .then((results) => {
            dbDebugger("User retrieved");
            client.release()
            resolve(results.rows);
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

const createUser = (username, password, email) => {
  //Stores a user in the users table

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("INSERT INTO users (username, password, email, created_on) VALUES ($1, $2, $3, NOW()) RETURNING user_id", [username, password, email])
          .then((results) => {
            dbDebugger("User uploaded to database");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

const updateUser = (user_id, username, password, email) => {
  //Updates the information of a user

  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("UPDATE users SET username=$1, password=$2, email=$3 WHERE user_id = $4", [username, password, email, user_id])
          .then((results) => {
            dbDebugger("User updated");
            client.release()
            resolve(results);
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

const deleteUser = (user_id) => {
  //Deletes a user
  
  return new Promise(async(resolve, reject) => {
    
    pool
      .connect()
      .then((client) => {
        client
          .query("DELETE FROM users WHERE user_id = $1", [user_id])
          .then((results) => {
            dbDebugger("User deleted")
            client.release()
            resolve(results)
          })
          .catch((error) => {
            dbDebugger("Error: ", error)
            client.release()
            reject(error)
          })
      })
  })
}

module.exports = {
  getUsers,
  getUserById,
  getUserByCredential,
  createUser,
  updateUser,
  deleteUser
}