const Pool = require("pg").Pool
const fs = require('fs')
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
    response.status(200).json(results.rows)
  })
}

const getFileById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query("SELECT * FROM files WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    var file = results.rows
    pool.query("SELECT lo_get($1)", [file[0].file_id], (error, results) => {
      if (error){
        throw error
      }
      var data = (results.rows[0].lo_get)

      fs.writeFile("./Temp_storage/test.docx", data, (error) => {
        if (error) {
          throw error
        }
      })

      response.status(200).json({
        file,
        data
      })
    })
  })
}

const storeFile = async (request, response) => {
  img_name = request.files.file.name
  file_type = img_name.substr(img_name.length - 3)

  path = (__dirname + "/" + request.files.file.tempFilePath).replace(/\\/g, "/")
  console.log(path)
  await getFileContents(path).then((data) => {

    pool.query("INSERT INTO files (file_id, file_type, img_name) VALUES (lo_from_bytea(0, $1), $2, $3)", [data, file_type, img_name], (error, results) => {
      if (error) {
        throw error
      } else{
        fsExtra.emptyDirSync("./Temp_storage")
        response.status(200).json(results)
      }
    })
  })

}

function getFileContents(path){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fs.readFileSync(path))
    }, 20000)
  })
}

module.exports = {
  getFiles,
  getFileById,
  storeFile
}