const bodyParser = require("body-parser");
const helmet = require("helmet");
const file_api = require("./APIs/file_api");
const fileupload = require("express-fileupload");
const express = require("express");
const app = express();

//Configeration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path:"./.env"})
  require("config");
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
app.use(helmet());

//Routes
const login = require("./routes/login");
const users = require("./routes/users");
const projects = require("./routes/projects");
const roles = require("./routes/roles");

//Routing
app.use("/login", login);
app.use("/users", users);
app.use("/projects", projects);
app.use("/roles", roles);

//File API
app.get("/files", file_api.getFiles);
app.get("/files/:id", file_api.getFileById);
app.post("/files", file_api.storeFile);
app.delete("/files/:id", file_api.deleteFile);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})