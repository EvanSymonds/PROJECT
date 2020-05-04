const express = require("express");
const router = express.Router();
const project_api = require("../APIs/project_api");
const project_settings_api = require("../APIs/project_settings_api");
const folder_api = require("../APIs/folder_api")
const file_api = require("../APIs/file_api")
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/", async (request, response) => {
  await project_api.getProjects().then((projects) => {
    response.status(200).json(projects);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.get("/:id", async (request, response) => {
  await project_api.getProjectById(parseInt(request.params.id)).then((project) => {
    response.status(200).json(project);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.post("/", async (request, response) => {
  const schema = {
    project_name: Joi.string().alphanum().min(3).max(25).required(),
    is_public: Joi.boolean().required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await project_api.createProject(request.body.project_name, request.body.is_public).then(async(results) => {
        const project_id = results.rows[0].project_id

        await project_settings_api.createProjectSettings(project_id).then(async() => {
          await folder_api.createFolder(project_id).then(async(results) => {

            await folder_api.renameFolder(results.rows[0].folder_id, 'ROOT').then((results) => {
              response.status(200).json(results)
            })
            .catch((error) => {
              debug(error)
              response.status(400).json(error)
            })

          })
          .catch((error) => {
            debug(error)
            response.status(400).json(error)
          })
        })
        .catch((error) => {
          debug(error)
          response.status(400).json(error)
        })
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    }
  })
})

router.post("/:id", async (request, response) => {
  const schema = {
    project_name: Joi.string().min(3).max(25).required(),
    is_public: Joi.boolean().required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error.details);
    } else {
      await project_api.updateProject(parseInt(request.params.id), request.body.project_name, request.body.is_public).then((results) => {
        debug("worked")
        response.status(200).json(results);
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    }
  })
})

router.delete("/:id", async (request, response) => {
  await project_api.deleteProject(parseInt(request.params.id)).then(async() => {
    
    await project_settings_api.deleteProjectSettings(parseInt(request.params.id)).then(async() => {

      await folder_api.deleteFoldersByProject(parseInt(request.params.id)).then(async() => {

        await file_api.deleteFilesByProject(parseInt(request.params.id)).then(async(results) => {
          response.status(200).json(results)
        })
        .catch((error) => {
          response.status(400).json(error);
        })
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    })
    .catch((error) => {
      response.status(400).json(error);
    })
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

module.exports = router;