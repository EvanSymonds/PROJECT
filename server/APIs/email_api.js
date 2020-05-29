//Setting up debugging channels
const dbDebugger = require("debug")("app:db");
const fsDebugger = require("debug")("app:fs");

//Configuration
const config = require("config");

let Email = require("email-templates")
const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendEmail = (destination, name, email, message) => {
  return new Promise((resolve, reject) => {

  })
}

module.exports = {
  sendEmail
}