const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const db = require("./queries")
const app = express()
const port = 3000

const storage = multer.diskStorage({
  destination: './Temp_storage',
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
    
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(root, 'Temp_storage'));
    },
    filename: (req, file, cb) => {
        const newFilename = file.originalname;
        cb(null, newFilename);
    },
  })
});

app.use(bodyParser.json({limit: "50mb"}))
app.use(
  bodyParser.urlencoded({
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
  db.storeFile(request, response)
  upload.single("Payload")
  try {
    const file = request.file

    if (!file) {
      response.status(400).send({
        status: false,
        data: "No file is selected"
      })
    } else {
      response.send({
        status: true,
        message: "File uploaded",
        data: {
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }
      })
    }
  }catch (err) {
    response.status(500).send(err);
  }
})