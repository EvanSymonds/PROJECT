const express = require("express");
const router = express.Router();
const project_settings_api = require("../APIs/project_settings_api");
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async (request, response) => {
  await project_settings_api.getSettingsByProject(parseInt(request.params.id)).then((settings) => {
    response.status(200).json(settings)
  })
  .catch((error) => {
    debug(error)
    response.status(400).json(error)
  })
})

router.post("/", async(request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
  }

  Joi.validate(request.body, schema, async(error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      await project_settings_api.createProjectSettings(request.body.project_id).then((results) => {
        response.status(200).json(results)
      })
      .catch((error) => {
        debug(error)
        response.status(400).json(error)
      })
    }
  })
})

router.post("/:id", async(request, response) => {
  const schema = {
    setting_name: Joi.string().min(3).max(25).required(),
    new_value: Joi.required()
  }

  Joi.validate(request.body, schema, async(error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      debug(request.body.setting_name)
      switch (request.body.setting_name) {
        case "changeSettingsAuth":
          await project_settings_api.changeSettingsAuth(parseInt(request.params.id), request.body.new_value).then((results) => {
            response.status(200).json(results)
          })
          .catch((error) => {
            debug(error)
            response.status(400).json(error)
          })
        case "editFilesAuth":
          await project_settings_api.editFilesAuth(parseInt(request.params.id), request.body.new_value).then((results) => {
            response.status(200).json(results)
          })
          .catch((error) => {
            debug(error)
            response.status(400).json(error)
          })
      }
    }
  })
})

router.delete("/:id", async (request, response) => {
  await project_settings_api.deleteProjectSettings(parseInt(request.params.id)).then((results) => {
    response.status(200).json(results)
  })
  .catch((error) => {
    debug(error)
    response.status(400).json(error)
  })
})

module.exports = router;