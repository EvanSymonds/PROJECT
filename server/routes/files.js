const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Readable } = require("stream")
const file_api = require("../APIs/file_api")

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/", async (request, response) => {
  await file_api.getFiles().then((files, error) => {
    if (error){
      debug("Error: ", error)
      response.status(400).json(error)
    } else {
      debug("Files retrieved")
      response.status(200).json(files)
    }
  })
})

router.get("/:id", async (request, response) => {

  await file_api.getFileById(parseInt(request.params.id)).then(async (file) => {
    response.setHeader("Content-Disposition", "attachment; filename=" + file.file_name)
    response.set('Content-Type', 'text/csv');
    response.status(200)

    const dataStream = new Readable({
      read() {}
    })

    dataStream.push(file.data)
    dataStream.push(null)
    
    dataStream.pipe(response)
  })
  .catch((error) => {
    debug("Error: ", error)
    response.status(400).json({error: error})
  })
})

router.get("/project/:id", async (request, response) => {
  await file_api.getFileInfoByProject(parseInt(request.params.id)).then((files, error) => {
    if (error) {
      debug("Error: ", error)
      response.status(400).json(error)
    } else  {
      debug("File Retrieved")
      response.status(200).json(files)
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
        await file_api.storeFile(request.files.file.data, request.files.file.name, request.body.project_id, request.files.file.tempFilePath).then((results, error) => {
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

router.delete("/:id", async (request, response) => {
  const schema = {
    id: Joi.number().integer().max(100000000).required(),
  }

  Joi.validate(request.params, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await file_api.deleteFile(parseInt(request.params.id)).then((results, error) => {
        if (error) {
          debug(error)
          response.status(400).json(error)
        } else {
          response.status(200).json(results)
        }
      })
    }
  })
})

module.exports = router;