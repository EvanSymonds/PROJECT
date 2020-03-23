const Pool = require("pg").Pool
const fsExtra = require('fs-extra')
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
  img_name = request.files.file.name
  file_type = img_name.substr(img_name.length - 3)

  path = (__dirname + request.files.file.tempFilePath).replace(/\\/g, "/")

  pool.query("INSERT INTO files (file_id, file_type, img_name) VALUES (lo_from_bytea(0, $1), $2, $3)", [path, file_type, img_name], (error, results) => {
    if (error) {
      throw error
    } else{
      fsExtra.emptyDirSync("./Temp_storage")
      response.status(200).json(results)
    }
  })
}

module.exports = {
  getFiles,
  getFileById,
  storeFile
}