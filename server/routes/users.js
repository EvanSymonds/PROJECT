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
  await user_api.getUsers().then((users) => {
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(400).json(error);
    })
})

router.get("/:id", async (request, response) => {
  await user_api.getUserById(parseInt(request.params.id)).then((user) => {
      response.status(200).json(user);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.post("/:id", async (request, response) => {
  const schema = {
    username: Joi.string().alphanum().min(3).max(25).required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await user_api.getUserById(parseInt(request.params.id)).then(async(user) => {
        let username = request.body.username

        if (user[0].username.substring(0, user[0].username.length - 5) != username){
          await user_api.updateUser(parseInt(request.params.id), username + "#" + randomize("0", 4), user[0].password, request.body.email).then((user) => {
            response.status(200).json(user);
          })
          .catch((error) => {
            debug(error)
            response.status(400).json(error);
          })
        } else {
          await user_api.updateUser(parseInt(request.params.id), user[0].username, user[0].password, request.body.email).then((user) => {
            response.status(200).json(user);
          })
          .catch((error) => {
            debug(error)
            response.status(400).json(error);
          })
        }
      })
      .catch((error) => {
        debug(error)
        response.status(400).json(error)
      })
    }
  })
})

router.delete("/:id", async (request, response) => {
  await user_api.deleteUser(parseInt(request.params.id)).then((results) => {
    response.status(200).json(results);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

module.exports = router;