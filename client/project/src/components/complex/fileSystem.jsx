import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import FolderPage from "./folderPage"
import axios from "axios"

const FileSystem = (props) => {
  const [folder, setFolder] = useState()
  const [folderViewed, setFolderViewed] = useState([])

  useEffect(() => {getProjectFiles(props.project_id)}, [])

  const rerender = () => {
    console.log("Rerender")
    getProjectFiles(props.project_id)
  }

  const handleEnterFolder = (folder_id, folder_name) => {
    setFolderViewed([...folderViewed, {
      folder_id: folder_id,
      folder_name: folder_name
    }])
    rerender()
  }

  const getFolderRendered = () => {
    let targetFolder = folder

    if (folderViewed.length === 0) {
      return folder
    } else {
      folderViewed.forEach((folderId) => {
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
    if (value === -1) {
      setFolderViewed([])
    } else {
      let destination

      folderViewed.forEach((folder, i) => {
        if (folder.folder_id === value){
          destination = i + 1
        }
      })

      setFolderViewed([...folderViewed].slice(0, destination))
    }
  }

  const getProjectFiles = async (project_id) => {

    const url = "http://localhost:3001/file_system/" + project_id
    await axios.get(url).then((results, error) => {
      if (error) {
        console.log(error)
      } else {
        if (results.status === 200) {
          setFolder(results.data)
        }
      }
    })
  }

  return (
    <div>
      {folder !== undefined && folderViewed !== [] ? <FolderPage 
        onReturn={handleReturn}
        ancestry={folderViewed}
        folder={getFolderRendered()} 
        rerender={rerender}
        handleEnterFolder={handleEnterFolder}
        project_id={props.project_id}
      /> : null}
    </div>
  )

}

export default FileSystem;