const config = require("config");
const bodyParser = require("body-parser");
const file_api = require("./file_api");
const user_api = require("./user_api")
const fileupload = require("express-fileupload");
const express = require("express");
const app = express();

//Configeration
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv').config();
}

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

//File API
app.get("/files", file_api.getFiles);
app.get("/files/:id", file_api.getFileById);
app.post("/files", file_api.storeFile);
app.delete("/files/:id", file_api.deleteFile);

//User API
app.get("/users", user_api.getUsers);
app.get("/users/:id", user_api.getUserById);
app.post("/users", user_api.storeUser);
app.post("/users/:id", user_api.updateUser)
app.delete("/users/:id", user_api.deleteUser);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})