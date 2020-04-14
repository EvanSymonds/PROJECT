const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs")
const fsExtra = require("fs-extra")
const profile_picture_api = require("../APIs/profile_picture_api")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/user/:id", async (request, response) => {
  await profile_picture_api.getProfilePictureByUser(parseInt(request.params.id)).then((profile_picture, error) => {
    if (error){
      debug("Error: ", error)
      response.status(400).json(error)
    } else {
      debug("Thumbnail retrieved")
      response.send(profile_picture)
    }
  })
})

router.post("/", async (request, response) => {
  const schema = {
    user_id: Joi.number().integer().max(100000000).required(),
  }

  if (!request.files) {
    response.status(400).send("No profile picture found")
  } else {
    Joi.validate(request.body, schema, async (error) => {
      if (error) {
        debug(error)
        response.status(400).json(error);
      } else {
        await profile_picture_api.storeProfilePicture(request.files.file.data, request.body.user_id).then((results, error) => {
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

router.delete("/user/:id", (async (request, response) => {
  await profile_picture_api.deleteProfilePicture(parseInt(request.params.id)).then((results, error) => {
    if (error) {
      response.status(400).json(error)
    } else {
      response.status(200).json(results)
    }
  })
}))

module.exports = router;