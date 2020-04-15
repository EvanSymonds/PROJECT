const express = require("express");
const router = express.Router();
const Joi = require("joi");
const thumbnail_api = require("../APIs/thumbnail_api")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async (request, response) => {
  await thumbnail_api.getThumbnailByProject(parseInt(request.params.id)).then((thumbnail, error) => {
    if (error){
      debug("Error: ", error)
      response.status(400).json(error)
    } else {
      debug("Thumbnail retrieved")
      response.send(thumbnail)
    }
  })
})

router.post("/", async (request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
  }

  if (!request.files) {
    response.status(400).send("No file found")
  } else {
    Joi.validate(request.body, schema, async (error) => {
      if (error) {
        debug(error)
        response.status(400).json(error);
      } else {
        await thumbnail_api.storeThumbnail(request.files.file.data, request.body.project_id).then((results, error) => {
          if (error) {
            debug(error)
            response.status(400).json(error)
          } else {
            response.status(200).json(results)
          }
        })
      }
    })
  }
})

router.delete("/project/:id", (async (request, response) => {
  await thumbnail_api.deleteThumbnail(parseInt(request.params.id)).then((results, error) => {
    if (error) {
      response.status(400).json(error)
    } else {
      response.status(200).json(results)
    }
  })
}))

module.exports = router;