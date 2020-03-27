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

router.get("/", async (request, response) => {
  await user_api.getUsers().then((error, users) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(users);
    }
  })
})

router.get("/:id", async (request, response) => {
  await user_api.getUserById(parseInt(request.params.id)).then((error, user) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(user);
    }
  })
})

router.post("/:id", async (request, response) => {
  const schema = {
    username: Joi.string().alphanum().min(3).max(25).required(),
    password: Joi.string().alphanum().min(3).max(25).required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      const username = request.body.username
      await user_api.getUserById(parseInt(request.params.id)).then((error, user) => {
        if (error) {
          response.status(400).json(error);
        } else {
          if (user.username.substring(0, user.username.length - 5) != username){
            username = request.body.username + "#" + randomize("0", 4);
          }
        }
      })

      debug(username);

      await bcrypt.genSalt(10).then(async (salt) => {
        await bcrypt.hash(request.body.password, salt).then(async (hashed) => {
          await user_api.updateUser(parseInt(request.params.id), username, hashed, request.body.email).then((error, user) => {
            if (error) {
              response.status(400).json(error);
            } else {
              response.status(200).json(user);
            }
          })
        })
      })
    }
  })
})

router.delete("/:id", async (request, response) => {
  await user_api.deleteUser(parseInt(request.params.id)).then((error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results);
    }
  })
})

module.exports = router;