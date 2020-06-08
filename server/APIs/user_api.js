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
pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

const getUsers = () => {
  //Gets all users

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM users ORDER BY user_id ASC")
      .then((results) => {
        dbDebugger("Users retrieved");
        connection.release()
        resolve(results.rows);
      })
  })
}

const getUserById = (user_id) => {
  //Gets a single user from an ID

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM users WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("User retrieved");
        connection.release()
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const getUserByCredential = (value) => {
  //Gets a single user from a credential

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("SELECT * FROM users WHERE position($1 in LOWER(username)) > 0 OR LOWER(email) = $1", [value.toLowerCase()])
      .then((results) => {
        dbDebugger("User retrieved");
        connection.release()
        resolve(results.rows);
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const createUser = (username, password, email) => {
  //Stores a user in the users table

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("INSERT INTO users (username, password, email, created_on) VALUES ($1, $2, $3, NOW()) RETURNING user_id", [username, password, email])
      .then((results) => {
        dbDebugger("User uploaded to database");
        connection.release()
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const updateUser = (user_id, username, password, email) => {
  //Updates the information of a user

  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("UPDATE users SET username=$1, password=$2, email=$3 WHERE user_id = $4", [username, password, email, user_id])
      .then((results) => {
        dbDebugger("User updated");
        connection.release()
        resolve(results);
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
      })
  })
}

const deleteUser = (user_id) => {
  //Deletes a user
  
  return new Promise(async(resolve, reject) => {
    const connection = await pool.connect();

    connection.query("DELETE FROM users WHERE user_id = $1", [user_id])
      .then((results) => {
        dbDebugger("User deleted")
        connection.release()
        resolve(results)
      })
      .catch((error) => {
        dbDebugger("Error: ", error)
        reject(error)
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