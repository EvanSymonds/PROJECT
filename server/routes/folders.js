const express = require("express");
const router = express.Router();
const folder_api = require("../APIs/folder_api")
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async(request, response) => {
  folder_api.getFoldersByProject(parseInt(request.params.id)).then((folders) => {
    response.status(200).json(folders)
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

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      await folder_api.createFolder(request.body.project_id).then((results) => {
        response.status(200).json(results)
      })
      .catch((error) => {
        response.status(400).json(error)
      })
    }
  })
})

router.post("/:id", async(request, response) => {
  const schema = {
    new_name: Joi.string().max(25).required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error)
    } else {
      await folder_api.renameFolder(parseInt(request.params.id), request.body.new_name).then((results) => {
        response.status(200).json(results)
      })
      .catch((error) => {[
        response.status(400).json(error)
      ]})
    }
  })
})

router.delete("/:id", async(request, response) => {
  await folder_api.deleteFolder(parseInt(request.params.id)).then((results) => {
    response.status(200).json(results)
  })
  .catch((error) => {
    response.status(400).json(error)
  })
})

module.exports = router;