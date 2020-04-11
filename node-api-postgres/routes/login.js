const express = require("express");
const router = express.Router();
const user_api = require("../APIs/user_api");
const randomize = require("randomatic");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.post("/", async(request, response) => {
  const schema = {
    credential: Joi.string().min(3).max(25).required(),
    password: Joi.string().alphanum().min(3).max(25).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await user_api.getUserByCredential(request.body.credential).then(async (user) => {
        if (user.length === 0) {
          return response.status(401).send("Invalid username or password")
        } else {
          const validPassword = await bcrypt.compare(request.body.password, user[0].password);
      
          if (!validPassword) return response.send("Invalid username or password");
      
          debug("Successfully logged in");

          const token = jwt.sign({ name: user[0].username }, config.get("jwtPrivateKey"))

          response.header("x-auth-token", token).status(200).send(user[0].username)
        }
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
          await user_api.createUser(username, hashed, request.body.email).then((result) => {
            const token = jwt.sign({ name: username }, config.get("jwtPrivateKey"))

            response.header("x-auth-token", token).status(200).send(username)
          })
        })
      })
    }
  })
})

module.exports = router;