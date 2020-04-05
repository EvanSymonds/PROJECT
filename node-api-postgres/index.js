const bodyParser = require("body-parser");
const helmet = require("helmet");
const fileupload = require("express-fileupload");
const cors = require('cors')
const express = require("express");
const app = express();

//Configeration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path:"./.env"})
  require("config");
}
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(fileupload({
  useTempFiles: false,
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
)
app.use(helmet());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Routes
const login = require("./routes/login");
const users = require("./routes/users");
const projects = require("./routes/projects");
const roles = require("./routes/roles");
const files = require("./routes/files");

//Routing
app.use("/login", login);
app.use("/users", users);
app.use("/projects", projects);
app.use("/roles", roles);
app.use("/files", files);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})