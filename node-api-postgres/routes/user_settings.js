const express = require("express");
const router = express.Router();
const Joi = require("joi");
const user_settings_api = require("../APIs/user_settings_api")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async(request, response) => {
  await user_settings_api.getUserSettings(parseInt(request.params.id)).then((settings, error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      debug("Settings received")
      response.status(200).json(settings)
    }
  })
})

router.post("/", async(request, response) => {
  await user_settings_api.createUserSettings(request.body.user_id).then((results, error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      debug("Settings created")
      response.status(200).json(results)
    }
  })
})

router.post("/:id", async(request, response) => {
  await user_settings_api.updateUserSettings(parseInt(request.params.id), request.body.theme).then((results, error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      debug("Settings updated")
      response.status(200).json(results)
    }
  })
})

router.delete("/:id", async(request, response) => {
  await user_settings_api.deleteUserSettings(parseInt(request.params.id)).then((results, error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      debug("Settings deleted")
      response.status(200).json(results)
    }
  })
})

module.exports = router