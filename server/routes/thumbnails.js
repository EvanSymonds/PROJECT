const express = require("express");
const router = express.Router();
const Joi = require("joi");
const thumbnail_api = require("../APIs/thumbnail_api")
const { Readable } = require("stream")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async (request, response) => {
  await thumbnail_api.getThumbnailByProject(parseInt(request.params.id)).then((thumbnail) => {
    debug("Thumbnail retrieved")

    if (thumbnail === null) {
      response.status(200).send(null)
    } else {
      response.set('Content-Type', 'image/png');
      response.status(200)

      response.send(thumbnail)
    }
  })
  .catch((error) => {
    console.log(error)
    debug("Error: ", error)
    response.status(400).json(error)
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
        console.log(error)
        response.status(400).json(error);
      } else {
        await thumbnail_api.storeThumbnail(request.files.file.data, request.body.project_id).then((results, error) => {
          if (error) {
            console.log(error)
            response.status(400).json(error)
          } else {
            response.status(200).json(results)
          }
        })
      }
    })
  }
})

router.post("/update", async (request, response) => {

  if (!request.files) {
    response.status(400).send("No file found")
  } else {
    await thumbnail_api.deleteThumbnail(request.body.project_id).then(async (results, error) => {
      if (error) {
        console.log(error)
        response.status(400).json(error)
      } else {
        await thumbnail_api.storeThumbnail(request.files.file.data, request.body.project_id).then((results, error) => {
          if (error) {
            console.log(error)
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
      console.log(error)
      response.status(400).json(error)
    } else {
      response.status(200).json(results)
    }
  })
}))

module.exports = router;