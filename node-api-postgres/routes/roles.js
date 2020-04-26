const express = require("express");
const router = express.Router();
const role_api = require("../APIs/role_api");
const user_api = require("../APIs/user_api")
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/", async (request, response) => {
  await role_api.getRoles().then((roles) => {
    response.status(200).json(roles);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.get("/project/:id", async (request, response) => {

  await role_api.getRolesByProject(parseInt(request.params.id)).then((roles) => {
    response.status(200).json(roles);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.get("/allusers/:id", async (request, response) => {
  await role_api.getRolesByProject(parseInt(request.params.id)).then(async(roles) => {

    let rolesWithUsers = []

    roles.forEach( async(role) => {
      const getUser = (role) => {
        return new Promise(async (resolve) => {
          return await user_api.getUserById(role.user_id).then((user) => {
            resolve(user)
          })
          .catch((error) => {
            response.status(400).json(error)
          })
        })
      }

      getUser(role).then((user) => {
        rolesWithUsers = [...rolesWithUsers, {
          role,
          user
        }]
        if (rolesWithUsers.length === roles.length) {
          response.status(200).send(rolesWithUsers)
        }
      })

    })

  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.get("/user/:id", async (request, response) => {
  await role_api.getRolesByUser(parseInt(request.params.id)).then((roles) => {
    response.status(200).json(roles);
  })
  .catch((error) => {
    response.status(400).json(error);
  })
})

router.post("/", async (request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
    role_name: Joi.string().min(3).max(25).required(),
    user_id: Joi.number().integer().max(10000000).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
    } else {
      await role_api.assignRole(request.body.project_id, request.body.role_name, request.body.user_id).then((results) => {
        response.status(200).json(results);
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    }
  })
})

router.post("/new", async (request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
    role_name: Joi.string().min(3).max(25).required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await role_api.createRole(request.body.project_id, request.body.role_name).then((results) => {
        response.status(200).json(results);
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    }
  })
})

router.post("/update", async (request, response) => {
  const schema = {
    role_id: Joi.number().integer().max(100000000).required(),
    new_name: Joi.string().min(3).max(25).required(),
    project_id: Joi.number().integer().max(100000000).required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error);
      debug(error)
    } else {
      await role_api.getRolesByProject

      await role_api.changeRole(request.body.role_id, request.body.new_name, request.body.project_id).then((results) => {
        response.status(200).json(results);
      })
      .catch((error) => {
        response.status(400).json(error);
      })
    }
  })
})

router.delete("/", async (request, response) => {
  await role_api.getRolesByProject(request.body.project_id).then(async (roles) => {
    if (roles.length === 1) {
      debug("Cannot delete all roles in a project")
      response.send("Cannot delete all roles in a project")
    } else {
      const targetRoles = roles.filter((role) => role.role_name === request.body.role_name)

      if (targetRoles.length > 1) {
        debug("There are still users in this role")
        response.send("There are still users in this role")
      } else {

        if (parseInt(targetRoles[0].authentication_level) === 9) {
          const roleRemoved = roles.filter((role) => role.authentication_level !== 9)

          const highestAuth = Math.max(...roleRemoved.map(role => role.authentication_level))

          const highestAuthRole = roleRemoved.filter((role) => role.authentication_level === highestAuth)

          role_api.updateRoleAuth(highestAuthRole[0].role_name ,request.body.project_id, 9)
        }
        await role_api.deleteRole(request.body.role_name, request.body.project_id).then((results) => {
          response.status(200).json(results);
        })
        .catch((error) => {
          response.status(400).json(error);
        })
      }
    }
  })
  .catch((error) => {
    response.status(400).json(error)
  })
})

module.exports = router;