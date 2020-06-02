const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs")
const fsExtra = require("fs-extra")
const file_api = require("../APIs/file_api")
const path = require('path');

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
  debug(request.params.id)

  await file_api.getFileById(parseInt(request.params.id)).then(async (file) => {
    response.setHeader("Content-Disposition", "attachment; filename=" + file.file[0].file_name)
    response.set('Content-Type', 'text/csv');
    response.status(200)
    
    const file_path = path.join(__dirname, "..", "Temp_storage", file.file[0].file_name)
    fs.createReadStream(file_path).pipe(response)
    fsExtra.emptyDir(path.join(__dirname, "..", "Temp_storage"))
  })
  .catch((error) => {
    debug("Error: ", error)
    response.status(400).json(error)
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