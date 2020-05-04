const express = require("express");
const router = express.Router();
const folder_children_api = require("../APIs/folder_children_api");
const folder_api = require("../APIs/folder_api")
const file_api = require("../APIs/file_api")
const fs = require("fs")
const fsExtra = require("fs-extra")
const Joi = require("joi");

//Setting up debugging channels
const debug = require("debug")("app:debug");

//Configuration
const config = require("config");

router.get("/:id", async(request, response) => {
  await folder_api.getFoldersByProject(parseInt(request.params.id)).then(async(projectFolders) => {

    projectFolders = projectFolders.rows

    projectFolders.forEach( async(projectFolder) => {
      folder_children_api.getRelationsByChild(projectFolder.folder_id).then(async (relations) => {
        if (relations.rows.length === 0) {
          const rootFolder = projectFolder

          const getFolderContents = async (parent_id, folder_id) => {
            return new Promise(async(resolve) => {

              const mapFolders = (folders) => {
                  return Promise.all(folders.map(async(row) => await getFolderContents(folder_id, parseInt(row.child_id)).then((folderContents) => folderContents )))
              }

              const mapFiles = (files) => {
                return Promise.all(files.map(async(file) => await file_api.getFileInfoById(file.child_id).then((file) => file.rows[0])
                ))
              }

              await folder_children_api.getFolderFolders(folder_id).then(async (folders) => {

                await folder_children_api.getFolderFiles(folder_id).then(async(files) => {

                  const file_system = {
                    folder_id: folder_id,

                    parent_id: parent_id,

                    files: [],

                    folders: []
                  }

                  mapFiles(files.rows).then((filesArray) => {
                    file_system.files = filesArray

                    mapFolders(folders.rows).then((childFolders) => {
                      file_system.folders = childFolders
                      resolve(file_system)
                    })
                  })
  
                })
              })
            })
          }

          await getFolderContents(null, rootFolder.folder_id).then((folderContents) => {
            response.status(200).json(folderContents)
          })
        }
      })
    })

  })
  .catch((error) => {
    response.status(400).json(error)
  })
})

router.post("/file", async (request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
    folder_id: Joi.number().integer().max(100000000).required(),
  }

  if (!request.files) {
    response.status(400).send("No file found")
  } else {
    Joi.validate(request.body, schema, async (error) => {
      if (error) {
        debug(error)
        response.status(400).json(error);
      } else {
        await file_api.storeFile(request.files.file.data, request.files.file.name, request.body.project_id, request.files.file.tempFilePath).then(async(results) => {
          await folder_children_api.createRelation(request.body.folder_id, results.rows[0].file_id, 'file').then((results) => {
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
      }
    })
  }
})

router.post("/folder", async(request, response) => {
  const schema = {
    project_id: Joi.number().integer().max(100000000).required(),
    folder_id: Joi.number().integer().max(100000000).required(),
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await folder_api.createFolder(request.body.project_id).then(async(results) => {

        await folder_children_api.createRelation(request.body.folder_id, results.rows[0].folder_id, 'folder').then((results) => {
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
    }
  })
})

router.post("/:id", async (request, response) => {
  const schema = {
    new_folder_id: Joi.number().integer().max(100000000).required(),
    type: Joi.string().valid(...["file", "folder"])
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await folder_children_api.updateRelation(request.body.new_folder_id, parseInt(request.params.id), request.body.type).then((results) => {
        response.status(200).json(results)
      })
      .catch((error) => {
        debug(error)
        response.status(400).json(error)
      })
    }
  })
})

router.delete("/:id", async(request, response) => {
  const schema = {
    folder_id: Joi.number().integer().max(100000000).required(),
    type: Joi.string().valid(...["file", "folder"])
  }

  Joi.validate(request.body, schema, async (error) => {
    if (error) {
      debug(error)
      response.status(400).json(error);
    } else {
      await folder_children_api.deleteRelation(request.body.folder_id, parseInt(request.params.id), request.body.type).then((results) => {
        response.status(200).json(results)
      })
      .catch((error) => {
        debug(error)
        response.status(400).json(error)
      })
    }
  })
})

module.exports = router;