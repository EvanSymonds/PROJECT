const express = require("express");
const router = express.Router();
const user_api = require("../APIs/user_api");
const user_settings_api = require("../APIs/user_settings_api")
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
  console.log("Endpoint recieved")
  const schema = {
    credential: Joi.string().min(3).max(25).required(),
    password: Joi.string().alphanum().min(3).max(25).required()
  }

  console.log("Schema created")

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      console.log("Failed validation")
      response.status(400).json(error);
    } else {
      await user_api.getUserByCredential(request.body.credential).then(async (users) => {
        if (users.length === 0) {
          console.log("Cannot find a user with those credentials")
          return response.status(401).json("Invalid username or password")
        } else {

          const checkForUser = async() => {
            return new Promise(async(resolve, reject) => {
              let token, username

              users.forEach(async(user, i) => {

                await bcrypt.compare(request.body.password, user.password).then((validPassword) => {
                  debug(validPassword)

                  if (validPassword) {
                    debug("Successfully logged in");
                    console.log("Password correct")
      
                    token = jwt.sign({ name: user.username, user_id: user.user_id }, config.get("jwtPrivateKey"))
      
                    username = user.username

                    console.log("Created token and username")
                    resolve([token, username])
                  } else {
                    reject()
                  }
                })

              })

            })
          }
          await checkForUser().then((results) => {
            console.log(results)
            response.header("x-auth-token", results[0]).status(200).json(results[1])
          })
          .catch((error) => {
            response.status(400).json("Invalid username or password")
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
        response.status(400).json({detail:"Username must only contain alphanumeric characters"})
      }else if (error.details[0].message === '"password" length must be at least 3 characters long') {
        response.status(400).json({detail:"Password must be more than 3 characters long"})
      }else if (error.details[0].message === '"password" length must be less than or equal to 25 characters long') {
        response.status(400).json({detail:"Password must be less than 25 characters"})
      } else if (error.details[0].message === '"password" must only contain alpha-numeric characters') {
        response.status(400).json({detail:"Password must only contain alphanumeric characters"})
      }
    } else {
      const username = request.body.username + "#" + randomize("0", 4);

      await bcrypt.genSalt(10).then(async (salt) => {
        await bcrypt.hash(request.body.password, salt).then(async (hashed) => {
          await user_api.createUser(username, hashed, request.body.email).then(async(result) => {
            const token = jwt.sign({ name: username, user_id: result.rows[0].user_id }, config.get("jwtPrivateKey"))

            await user_settings_api.createUserSettings(result.rows[0].user_id).then(() => {
              response.header("x-auth-token", token).status(200).json(username)
            })
            .catch((error) => {
              debug(error)
              response.status(400).json(error)
            })
          })
          .catch((error) => {
            console.log(error)
            if (error.detail.substring(0,11) === "Key (email)") {
              response.status(409).json({detail:"Email already exists"})
            }
          })
        })
      })
    }
  })
})

router.post("/authlevel/", async(request, response) => {
  const token = jwt.decode(JSON.parse(request.body.token))

  await role_api.getRolesByUser(token.user_id).then(async (results) => {

    if (results.length > 0) {
      
      let role = results.filter((result) => result.project_id === request.body.project_id)

      if (role.length === 1) {
        
        const authToken = jwt.sign({
          name: token.name,
          role_id: role[0].role_id,
          user_id: token.user_id,
          authLevel: role[0].authorisation_level
        }, config.get("jwtPrivateKey"))

        response.header("x-auth-token", authToken).status(200).json("AUTHENTICATION LEVEL RECEIVED")
      }
  
    } else {
      response.status(400).json("User does not exist")
    }
  })
  .catch((error) => {
    debug(error)
    response.status(400).json(error.response)
  })
})

module.exports = router;