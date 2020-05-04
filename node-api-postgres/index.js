const bodyParser = require("body-parser");
const helmet = require("helmet");
const fileupload = require("express-fileupload");
const cors = require('cors')
const express = require("express");
const app = express();
const config = require("config");

//Configeration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path:"./.env"})
  require("config");
}
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
if(!config.get("database.db_password")) {
  console.error("FATAL ERROR: DB_PASSWORD is not defined")
  process.exit(1)
}
if(!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined")
  process.exit(1)
}

app.use(fileupload({
  useTempFiles: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 1000000,
  })
)
app.use(helmet());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Expose-Headers', 'x-auth-token')
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Routes
const auth = require("./routes/auth");
const users = require("./routes/users");
const projects = require("./routes/projects");
const project_settings = require("./routes/project_settings");
const roles = require("./routes/roles");
const files = require("./routes/files");
const folders = require("./routes/folders");
const file_system = require("./routes/file_system");
const thumbnails = require("./routes/thumbnails");
const profile_pictures = require("./routes/profile_pictures");
const user_settings = require("./routes/user_settings");

//Routing
app.use("/auth", auth);
app.use("/users", users);
app.use("/projects", projects);
app.use("/project_settings", project_settings);
app.use("/roles", roles);
app.use("/files", files);
app.use("/folders", folders);
app.use("/file_system", file_system);
app.use("/thumbnails", thumbnails);
app.use("/profile_pictures", profile_pictures);
app.use("/user_settings", user_settings);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})