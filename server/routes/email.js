const express = require("express");
const router = express.Router();
const Joi = require("joi");
const email_api = require("../APIs/email_api")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.post("", async(request, response) => {
  const schema = {
    name: Joi.string().alphanum().max(40),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    message: Joi.string().max(500)
  }

  Joi.validate(request.params, schema, async(error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await email_api.sendEmail()
    }
  })
})

module.exports = router;