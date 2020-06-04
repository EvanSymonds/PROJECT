import React, { useState, useEffect } from "react";
import FolderPage from "./folderPage"
import axios from "axios"

var jwt = require("jsonwebtoken")

const FileSystem = (props) => {
  const [folder, setFolder] = useState()
  const [ancestry, setAncestry] = useState(null)

  useEffect(() => {getProjectFiles(props.project_id); return () => setFolder([])}, [])

  const rerender = () => {
    getProjectFiles(props.project_id)
  }

  const handleEnterFolder = (folder_id, folder_name, authorisation_level) => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    if (token.authLevel >= authorisation_level){
      setAncestry([...ancestry, {
        folder_id: folder_id,
        folder_name: folder_name
      }])
      rerender()
    }
  }

  const getFolderRendered = () => {
    let targetFolder = folder

    if (ancestry.length === 1) {
      return folder
    } else {
      ancestry.forEach((folderId) => {
        targetFolder.folders.forEach((childFolder) => {
          if (childFolder.folder_id === folderId.folder_id) {
            targetFolder = childFolder
          }
        })
      })
      return targetFolder
    }
  }

  const handleReturn = (value) => {
    let destination

    ancestry.forEach((folder, i) => {
      if (folder.folder_id === value){
        destination = i + 1
      }
    })

    setAncestry([...ancestry].slice(0, destination))
  }

  const getProjectFiles = async (project_id) => {

    const url = "/api/file_system/" + project_id
    await axios.get(url).then((results) => {
      if (results.status === 200) {
        setFolder(results.data)
        if (ancestry === null) {
          setAncestry([{
            folder_id: results.data.folder_id,
            folder_name: results.data.folder_name
          }])
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <div
      style={{
        height: "calc(100% - 87)"
      }}
    >
      {folder !== undefined && ancestry !== null ? <FolderPage 
        onReturn={handleReturn}
        ancestry={ancestry}
        folder={getFolderRendered()} 
        rerender={rerender}
        handleEnterFolder={handleEnterFolder}
        project_id={props.project_id}
      /> : null}
    </div>
  )

}

export default FileSystem;