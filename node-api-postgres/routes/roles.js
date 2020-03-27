const express = require("express");
const router = express.Router();
const roles_api = require("../APIs/role_api");
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/", async (request, response) => {
  await roles_api.getRoles().then((error, roles) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(roles);
    }
  })
})

router.get("/project/:id", async (request, response) => {
  debug(parseInt(request.params.id))

  await roles_api.getRolesByProject(parseInt(request.params.id)).then((error, roles) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(roles);
    }
  })
})

router.get("/user/:id", async (request, response) => {
  await roles_api.getRolesByUser(parseInt(request.params.id)).then((error, roles) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(roles);
    }
  })
})

router.post("/", async (request, response) => {
  const schema = {
    project_id: Joi.number.integer().max(100000000).required(),
    project_name: Joi.string().alphanum().min(3).max(25).required(),
    user_id: Joi.number.integer().max(10000000).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await roles_api.createRole(request.body.project_id, request.body.role_name, request.body.user_id).then((error, results) => {
        if (error) {
          response.status(400).json(error);
        } else {
          response.status(200).json(results);
        }
      })
    }
  })
})

router.post("/update", async (request, response) => {
  const schema = {
    project_id: Joi.number.integer().max(100000000).required(),
    project_name: Joi.string().alphanum().min(3).max(25).required(),
    user_id: Joi.number.integer().max(10000000).required(),
    new_name: Joi.string().alphanum().min(3).max(25).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await roles_api.updateRole(request.body.project_id, request.body.role_name, request.body.user_id, request.body.new_name).then((error, results) => {
        if (error) {
          response.status(400).json(error);
        } else {
          response.status(200).json(results);
        }
      })
    }
  })
})

router.delete("/delete", async (request, response) => {
  await roles_api.deleteRole(request.body.project_id, request.body.role_name, request.body.user_id).then((error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results);
    }
  })
})

module.exports = router;