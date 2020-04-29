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

router.post("/auth/update", async(request, response) => {
  const schema = {
    role_name: Joi.string().min(3).max(25).required(),
    project_id: Joi.number().integer().max(100000000).required(),
    auth_level: Joi.number().integer().max(9).min(1).required()
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      response.status(400).json(error)
    } else {

      await role_api.updateRoleAuth(request.body.role_name, request.body.project_id, request.body.auth_level).then((results) => {
        response.status(200).send("Updated role")
      })
      .catch((error) => {
        response.status(400).json(error)
      })

    }
  })
})

router.post("/update", async (request, response) => {
  const schema = {
    role_id: Joi.number().integer().max(100000000).required(),
    new_role: Joi.string().min(3).max(25).required(),
    project_id: Joi.number().integer().max(100000000).required(),
  }

  Joi.validate(request.body, schema, async (error) => {

    //MAKE ROLES WITH USERS
    let final_roles = []

    await role_api.getRolesByProject(request.body.project_id).then((projectRoles) => {

      let api_roles = []

      //get an array with every type of role
      projectRoles.forEach((role) => {

        const pos = api_roles.map((api_role) => { return api_role.role_name }).indexOf(role.role_name)

        if (pos === -1) {
          api_roles = [...api_roles, {
            role_name: role.role_name,
            authorisation_level: role.authorisation_level
          }]
        }
      })
      //get an array with every type of role

      api_roles.forEach((api_role) => {
        api_role_users = []

        projectRoles.forEach((projectRole) => {
          if (projectRole.role_name === api_role.role_name) {
            api_role_users = [...api_role_users, projectRole.user_id]
          }
        })

        final_roles = [...final_roles, {
          api_role: api_role,
          api_role_users: api_role_users
        }]
      })

    })
    //MAKE ROLES WITH USERS

    //IS USER LEVEL 9
    await role_api.getRolesById(request.body.role_id).then((role) => {
      if (role[0].authorisation_level == 9){

        let correspondingRole

        final_roles.forEach((final_role) => {

          if (final_role.api_role.role_name === role[0].role_name) {
            correspondingRole = final_role
          }

        })

        //ARE THERE OTHER USERS IN THIS ROLE

        if (correspondingRole.api_role_users.length < 3) {
          
          //FIND THE NEXT ROLE IN LINE TO BE ADMIN

          let highestAuth = 0

          final_roles.forEach((final_role) => {
            if (final_role.api_role.authorisation_level > highestAuth && final_role.api_role.authorisation_level !== 9) {
              highestAuth = final_role.api_role.authorisation_level
            }
          })

          highestAuthRoles = final_roles.filter((role) => role.api_role.authorisation_level === highestAuth && role.api_role_users.length > 1)

          //FIND THE NEXT ROLE IN LINE TO BE ADMIN

          //MAKE THAT ROLE LEVEL 9

          role_api.updateRoleAuth(highestAuthRoles[0].api_role.role_name, request.body.project_id, 9)

          //MAKE THAT ROLE LEVEL 9

          //MAKE THE OTHER ROLE LEVEL 8

          role_api.updateRoleAuth(correspondingRole.api_role.role_name, request.body.project_id, 8)

          //MAKE THE OTHER ROLE LEVEL 8

        }

        //ARE THERE OTHER USERS IN THIS ROLE

      }
    })
    //IS USER LEVEL 9

    //EXECUTE CHANGE

    role_api.changeRole(request.body.role_id, request.body.new_role, request.body.project_id).then((results) => {
      response.status(200).json(results)
    })
    .catch((error) => {
      response.status(400).json(error)
    })

    //EXECUTE CHANGE

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

        if (parseInt(targetRoles[0].authorisation_level) === 9) {
          const roleRemoved = roles.filter((role) => role.authorisation_level !== 9)

          const highestAuth = Math.max(...roleRemoved.map(role => role.authorisation_level))

          const highestAuthRole = roleRemoved.filter((role) => role.authorisation_level === highestAuth)

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