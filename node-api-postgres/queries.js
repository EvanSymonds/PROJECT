const Pool = require("pg").Pool
const { Readable } = require('stream');
const pool = new Pool({
  user: "evan",
  host: "localhost",
  database: "project",
  password: "Ebanisia5p",
  port: "5432",
})

const getFiles = (request, response) => {
  pool.query("SELECT * FROM files ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.row)
  })
}

const getFileById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query("SELECT * FROM files WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const storeFile = (request, response) => {
  pool.query("SELECT lo_create(0)",
  (error, results) => {
    console.log(results)
    if (error) {
      throw error
    }
    response.status(200).json()
  })
}

module.exports = {
  getFiles,
  getFileById,
  storeFile
}