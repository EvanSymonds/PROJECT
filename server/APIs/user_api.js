//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

//Pool allows express to communicate with PostgreSQL database
const Pool = require("pg").Pool;

const getUsers = () => {
  //Gets all users

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM users ORDER BY user_id ASC")
      .then((results) => {
        dbDebugger("Users retrieved");
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const getUserById = (user_id) => {
  //Gets a single user from an ID

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM users WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("User retrieved");
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const getUserByCredential = (value) => {
  //Gets a single user from a credential

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("SELECT * FROM users WHERE position($1 in LOWER(username)) > 0 OR LOWER(email) = $1", [value.toLowerCase()])
      .then((results) => {
        dbDebugger("User retrieved");
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const createUser = (username, password, email) => {
  //Stores a user in the users table

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("INSERT INTO users (username, password, email, created_on) VALUES ($1, $2, $3, NOW()) RETURNING user_id", [username, password, email])
      .then((results) => {
        dbDebugger("User uploaded to database");
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const updateUser = (user_id, username, password, email) => {
  //Updates the information of a user

  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("UPDATE users SET username=$1, password=$2, email=$3 WHERE user_id = $4", [username, password, email, user_id])
      .then((results) => {
        dbDebugger("User updated");
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
  })
}

const deleteUser = (user_id) => {
  //Deletes a user
  
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: config.get("database.user"),
      host: config.get("database.host"),
      database: config.get("database.database"),
      password: config.get("database.db_password"),
      port: config.get("database.port"),
    });

    pool.query("DELETE FROM users WHERE user_id = $1", [user_id])
      .then((results) => {

      })
      .catch((error) => {
        dbDebugger("Error: ", error);
        reject(error);
      })
      .then(() => pool.end())
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