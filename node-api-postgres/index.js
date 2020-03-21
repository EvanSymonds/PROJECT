const express = require("express")
const bodyParser = require("body-parser")
const db = require("./queries")
const busboy = require("busboy")
const app = express()
const port = 3000

app.use(bodyParser.json({limit: "50mb"}))
app.use(busboy());
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
  var fstream;
    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            response.redirect('back');
        });
    });
  console.log(request.files)
  db.storeFile(request, response)
})