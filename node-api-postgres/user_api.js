//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const requestDebugger = require("debug")("app:request");

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

const getUsers = (request, response) => {
  //Gets all users

  pool.query("SELECT * FROM users ORDER BY user_id ASC", (error, results) => {
    if (error){
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("Users retrieved");
    }
    response.status(200).json(results);
  })
}

const getUserById = (request, response) => {
  //Gets a single user from an ID

  const user_id = parseInt(request.params.id);

  requestDebugger("User_id: ", user_id);

  pool.query("SELECT * FROM users WHERE user_id = $1", [user_id], (error, results) => {
    if (error){
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("User retrieved");
    }
    response.status(200).json(results);
  })
}

const storeUser = (request, response) => {
  //Stores a user in the users table

  const username = request.body.username;
  const password = request.body.password;
  const email = request.body.email;

  requestDebugger(username, password, email);

  pool.query("INSERT INTO users (username, password, email, created_on) VALUES ($1, $2, $3, NOW())", [username, password, email], (error, result) => {
    if (error) {
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("User uploaded to database");
    }

    response.status(200).json(result);
  })

}

const updateUser = (request, response) => {
  //Updates the information of a user

  const user_id = parseInt(request.params.id);
  const username = request.body.username;
  const password = request.body.password;
  const email = request.body.email;

  requestDebugger("User_id: ", user_id);

  pool.query("UPDATE users SET username=$1, password=$2, email=$3 WHERE user_id = $4", [username, password, email, user_id], (error, result) => {
    if (error){
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("User updated");
      response.status(200).json(result);
    }
  })
}

const deleteUser = (request, response) => {
  //Deletes a user

  const user_id = parseInt(request.params.id);

  requestDebugger("User_id: ", user_id);

  pool.query("DELETE FROM users WHERE user_id = $1", [user_id], (error, result) => {
    if (error){
      dbDebugger("Error: ", error);
    } else {
      dbDebugger("User deleted");
      response.status(200).json(result);
    }
  })
}

module.exports = {
  getUsers,
  getUserById,
  storeUser,
  updateUser,
  deleteUser
}