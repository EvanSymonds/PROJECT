const express = require("express")
const bodyParser = require("body-parser")
const db = require("./queries")
var fileupload = require("express-fileupload");
const app = express()
const port = 3000

app.use(fileupload({
  useTempFiles: true,
  tempFileDir: "./Temp_storage/"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
)

app.get("/", (request, response) => {
  response.json({ info: 'Node.js, Express and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

app.get("/files", db.getFiles)
app.get("/files/:id", db.getFileById)
app.post("/files", (request, response) => {
  var file;

    if(!request.files)
    {
        response.send("File was not found");
        return;
    }

    file = request.files.FormFieldName;  // here is the field name of the form

    response.send("File Uploaded");
    console.log(request.files.file.tempFilePath)
    path = request.files.file.tempFilePath.replace(`\`, )

  db.storeFile(request, response, path)
})