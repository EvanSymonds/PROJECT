const express = require("express")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const db = require("./queries")
const app = express()
const port = 3000

app.use(bodyParser.json({limit: "50mb"}))
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
)
app.use(fileUpload({
  createParentPath: true
}));

app.get("/", (request, response) => {
  response.json({ info: 'Node.js, Express and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

app.get("/files", db.getFiles)
app.get("/files/:id", db.getFileById)
app.post("/files", upload.array(), db.storeFile)