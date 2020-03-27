const express = require("express");
const router = express.Router();
const user_api = require("../APIs/user_api");
const randomize = require("randomatic");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.post("/", async(request, response) => {
  const schema = {
    credential: Joi.string().alphanum().min(3).max(25).required(),
    password: Joi.string().alphanum().min(3).max(25).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await user_api.getUserByCredential(request.body.credential).then(async (user) => {
        if (!user) return response.status(400).send("Invalid username or password");
        
        const validPassword = await bcrypt.compare(request.body.password, user[0].password);
    
        if (!validPassword) return response.status(400).send("Invalid username or password");
    
        debug("Successfully logged in");
        response.status(200).send("Logged in");
      })
    }
  })
})

router.post("/signup", async(request, response) => {
  const schema = {
    username: Joi.string().alphanum().min(3).max(25).required(),
    password: Joi.string().alphanum().min(3).max(25).required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      const username = request.body.username + "#" + randomize("0", 4);

      await bcrypt.genSalt(10).then(async (salt) => {
        await bcrypt.hash(request.body.password, salt).then(async (hashed) => {
          await user_api.create(username, hashed, request.body.email).then((result) => {
            response.status(200).json(result);
          })
        })
      })
    }
  })
})

module.exports = router;