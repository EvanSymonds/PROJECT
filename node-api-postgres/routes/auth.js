const express = require("express");
const router = express.Router();
const user_api = require("../APIs/user_api");
const role_api = require("../APIs/role_api")
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

          const token = jwt.sign({ name: user[0].username, user_id: user[0].user_id }, config.get("jwtPrivateKey"))

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
      if (error.details[0].message === 'email" must be a valid email') {
        response.status(400).json({detail: "Email is invalid"})
      } else if (error.details[0].message === '"username" length must be at least 3 characters long') {
        response.status(400).json({detail: "Username must be more than 3 characters long"})
      }else if (error.details[0].message === '"username" length must be less than or equal to 25 characters long') {
        response.status(400).json({detail: "Username must be less than 25 characters"})
      } else if (error.details[0].message === '"username" must only contain alpha-numeric characters') {
        response.status(400).send({detail:"Username must only contain alphanumeric characters"})
      }else if (error.details[0].message === '"password" length must be at least 3 characters long') {
        response.status(400).send({detail:"Password must be more than 3 characters long"})
      }else if (error.details[0].message === '"password" length must be less than or equal to 25 characters long') {
        response.status(400).send({detail:"Password must be less than 25 characters"})
      } else if (error.details[0].message === '"password" must only contain alpha-numeric characters') {
        response.status(400).send({detail:"Password must only contain alphanumeric characters"})
      }
    } else {
      const username = request.body.username + "#" + randomize("0", 4);

      try{
        await bcrypt.genSalt(10).then(async (salt) => {
          await bcrypt.hash(request.body.password, salt).then(async (hashed) => {
            await user_api.createUser(username, hashed, request.body.email).then((result) => {
              const token = jwt.sign({ name: username, user_id: user[0].user_id }, config.get("jwtPrivateKey"))

              response.header("x-auth-token", token).status(200).send(username)
            })
          })
        })
      }
      catch (error) {
        if (error.detail.substring(0,11) === "Key (email)") {
          response.status(409).json({detail:"Email already exists"})
        }
      }
    }
  })
})

router.post("/authlevel/", async(request, response) => {
  const token = jwt.decode(JSON.parse(request.body.token))

  await role_api.getRolesByUser(token.user_id).then(async (results) => {

    if (results.length > 0) {
      
      results.filter((result) => result.project_id === request.body.project_id)

      if (results.length === 1) {

        debug(token.name)
        
        const authToken = jwt.sign({
          name: token.name,
          user_id: token.user_id,
          authLevel: results[0].authentication_level
        }, config.get("jwtPrivateKey"))

        response.header("x-auth-token", authToken).status(200).send("AUTHENTICATION LEVEL RECEIVED")
      }
  
    } else {
      response.status(400).send("User does not exist")
    }
  })
  .catch((error) => {
    debug(error)
    response.status(400).json(error.response)
  })
})

module.exports = router;