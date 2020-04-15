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
const login = require("./routes/login");
const users = require("./routes/users");
const projects = require("./routes/projects");
const roles = require("./routes/roles");
const files = require("./routes/files");
const thumbnails = require("./routes/thumbnails");
const profile_pictures = require("./routes/profile_pictures");
const user_settings = require("./routes/user_settings");

//Routing
app.use("/login", login);
app.use("/users", users);
app.use("/projects", projects);
app.use("/roles", roles);
app.use("/files", files);
app.use("/thumbnails", thumbnails);
app.use("/profile_pictures", profile_pictures);
app.use("/user_settings", user_settings);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})