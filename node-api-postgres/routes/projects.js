const express = require("express");
const router = express.Router();
const project_api = require("../APIs/project_api");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/", async (request, response) => {
  await project_api.getProjects().then((error, projects) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(projects);
    }
  })
})

router.get("/:id", async (request, response) => {
  await project_api.getProjectById(parseInt(request.params.id)).then((error, project) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(project);
    }
  })
})

router.post("/", async (request, response) => {
  await project_api.createProject(request.body.project_name, request.body.is_public).then((error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results);
    }
  })
})

router.post("/:id", async (request, response) => {
  await project_api.updateProject(parseInt(request.params.id), request.body.project_name, request.body.is_public).then((error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results);
    }
  })
})

router.delete("/:id", async (request, response) => {
  await project_api.deleteProject(parseInt(request.params.id)).then((error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results);
    }
  })
})

module.exports = router;