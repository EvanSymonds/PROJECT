const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require('cors')
const path = require("path")

const express = require("express");
const http = require('http')
const socketIo = require('socket.io')

const port = process.env.PORT || 3001;
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

//Configeration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require("./startup/prod")(app)

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
  app.use("/static", express.static("assets"));

   app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "client",  "build", "index.html"));
    });
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
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Expose-Headers', 'x-auth-token')
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next()
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


io.on("connection", (socket) => {
  console.log("New connection")

  socket.on("INVITE_SENT", (user_id) => {
    socket.emit("PROJECT_INVITE", parseInt(user_id))
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

server.listen(port, () => {
  console.log(`App running on port ${port}`);
})