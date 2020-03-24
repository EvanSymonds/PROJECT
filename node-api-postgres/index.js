const express = require("express");
const bodyParser = require("body-parser");
const file_api = require("./file_api");
var fileupload = require("express-fileupload");
const app = express();

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
  response.json({ info: 'Node.js, Express and Postgres API' });
})

app.get("/files", file_api.getFiles);
app.get("/files/:id", file_api.getFileById);
app.post("/files", (request, response) => {
    if(!request.files)
    {
        response.status(400).send("File was not found");
        return;
    }

  file_api.storeFile(request, response);
})
app.delete("/files/:id", file_api.deleteFile);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})