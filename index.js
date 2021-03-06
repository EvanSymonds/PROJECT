const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require('cors')
const path = require("path")

const express = require("express");

const port = process.env.PORT || 3001;
const app = express();
var errorHandler = require('errorhandler')

//Configeration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require("./server/startup/prod")(app)

const config = require("config");

if(!config.get("database.db_password")) {
  console.error("FATAL ERROR: DB_PASSWORD is not defined")
  process.exit(1)
}
if(!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined")
  process.exit(1)
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")))

  app.get("/favicon.ico", (req, res) => {
    res.sendFile("favicon.ico");
});
}
app.use(cors({ origin: '*' }));
app.use(fileupload({
  useTempFiles: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 1000000,
  })
)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Expose-Headers', 'x-auth-token')
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next()
});

//Routes
const auth = require("./server/routes/auth");
const users = require("./server/routes/users");
const projects = require("./server/routes/projects");
const project_settings = require("./server/routes/project_settings");
const roles = require("./server/routes/roles");
const files = require("./server/routes/files");
const folders = require("./server/routes/folders");
const file_system = require("./server/routes/file_system");
const thumbnails = require("./server/routes/thumbnails");
const profile_pictures = require("./server/routes/profile_pictures");
const user_settings = require("./server/routes/user_settings");

//Routing
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/project_settings", project_settings);
app.use("/api/roles", roles);
app.use("/api/files", files);
app.use("/api/folders", folders);
app.use("/api/file_system", file_system);
app.use("/api/thumbnails", thumbnails);
app.use("/api/profile_pictures", profile_pictures);
app.use("/api/user_settings", user_settings);

app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

if (process.env.NODE_ENV === "production") {
  app.get(path.join(__dirname, "client", "build", "index.html"), (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  })
}

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})