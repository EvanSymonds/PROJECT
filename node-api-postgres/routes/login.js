const express = require("express");
const router = express.Router();
const user_api = require("../APIs/user_api");
const randomize = require("randomatic");
const bcrypt = require("bcrypt");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.post("/", async(request, response) => {
  const value = request.body.credential;

  await user_api.getUserByCredential(value).then(async (user) => {
    if (!user) return response.status(400).send("Invalid username or password");
    
    const validPassword = await bcrypt.compare(request.body.password, user[0].password);

    if (!validPassword) return response.status(400).send("Invalid username or password");

    debug("Successfully logged in");
    response.status(200).send("Logged in");
  })
})

router.post("/signup", async(request, response) => {
  const username = request.body.username + "#" + randomize("0", 4);

  await bcrypt.genSalt(10).then(async (salt) => {
    await bcrypt.hash(request.body.password, salt).then(async (hashed) => {
      await user_api.create(username, hashed, request.body.email).then((result) => {
        response.status(200).json(result);
      })
    })
  })
})

module.exports = router;