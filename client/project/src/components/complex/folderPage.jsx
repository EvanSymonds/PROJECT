import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles";
import Breadcrumbs from "../basics/breadcrumbs"
import FileSystemMenu from "./fileSystemMenu"
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/grid"
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import FileUpload from "../complex/fileUpload"
import File from "../basics/file"
import Folder from "../basics/folder"
import axios from "axios"

const FolderPage = (props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null)
  const [listenForDrag, setListenForDrag] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "90%",
      marginLeft: 10,
    },
    folderContainer: {
      marginLeft: 30,
    },
    fileContainer: {
      marginTop: 30
    }
  }))
  const classes = useStyles()

  const onDeleteFile = (e) => {
    props.rerender()
  }

  const onAddFile = () => {
    props.rerender()
  }

  const onCreateFolder = () => {
    let formData = new FormData()
    formData.append("project_id", props.project_id)
    formData.append("folder_id", props.folder.folder_id)

    axios.post("http://localhost:3001/file_system/folder", formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onDeleteFolder = (folder_id) => {
    let formData = new FormData()
    formData.append("type", "folder")
    formData.append ("folder_id", props.folder.folder_id)

    axios.post("http://localhost:3001/file_system/delete/" + folder_id, formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleFolderSelect = (folder_id) => {
    if (folder_id === null) {
      setSelected(null)
    } else {
      setSelected(null)
      props.folder.folders.forEach((childFolder) => {
        if (childFolder.folder_id === folder_id) {
          setSelected(childFolder)
        }
      })
    }
  }

  const onAddAuth = () => {
    let formData = new FormData()
    formData.append("new_auth", 1)

    axios.post("http://localhost:3001/file_system/auth/" + selected.folder_id, formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }
  
  const handleDragStart = (child_id) => {
    setListenForDrag(child_id)
  }

  const handleDragStop = () => {
    setListenForDrag(false)
  }

  const renderFiles = () => {
    return props.folder.files.map((file, i) => {
        if (props.folder.files.length === i + 1){
          return (
            <div 
              key={i}
              data-testid='component-file'
            >
              <File 
                key={i} 
                fileIndex={i} 
                fileType={file.file_type} 
                fileName={file.file_name} 
                file_id={file.file_id} 
                updateParent={onDeleteFile}
                folder_id={props.folder.folder_id}
                onDragStart={handleDragStart}
                onDragStop={handleDragStop}
              />
            </div>
          )
        } else {
          return (
            <div key={i}>
              <div 
                data-testid='component-file'
                key={i}
              >
                <File 
                  fileIndex={i}
                  fileType={file.file_type} 
                  fileName={file.file_name} 
                  file_id={file.file_id} 
                  updateParent={onDeleteFile}
                  folder_id={props.folder.folder_id}  
                  onDragStart={handleDragStart}
                  onDragStop={handleDragStop}
                />
              </div>
              <Divider light key={"divider"+i}/>
            </div>
          )
        }
    })
  }

  const onColorChange = (color) => {
    let formData = new FormData()
    formData.append("color", color)

    axios.post("http://localhost:3001/file_system/color/" + selected.folder_id, formData).then(() => {
      props.rerender()
      setSelected(null)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleEnterFolder = (folder_id, authorisation_level) => {
    let folder_name

    props.folder.folders.forEach((childFolder) => {
      if (childFolder.folder_id === folder_id) {
        folder_name = childFolder.folder_name
      }
    })

    props.handleEnterFolder(folder_id, folder_name, authorisation_level)
  }

  const renderFolders = () => {
    return props.folder.folders.map((folder, i) => {
      return (
        <Grid
          item
          key={i}
        >
          <Folder
            listenForDrag={listenForDrag}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            folder_name={folder.folder_name}
            authorisation_level={folder.authorisation_level}
            handleEnterFolder={handleEnterFolder}
            folder_id={folder.folder_id}
            folderColor={folder.folder_color}
            onDelete={onDeleteFolder}
            rerender={props.rerender}
            selectFolder={handleFolderSelect}
            selected={selected === null ? false : selected.folder_id === folder.folder_id}
          />
        </Grid>
      )
    })
  }

  return (

    <React.Fragment>
      <FileSystemMenu 
        onClickUpload={handleOpen} 
        onCreateFolder={onCreateFolder}
        onAddAuth={onAddAuth}
        selectedFolder={selected}
        onColorChange={onColorChange}
      />
      <Breadcrumbs 
        ancestry={props.ancestry}
        onReturn={props.onReturn}
        listenForDrag={listenForDrag}
        rerender={props.rerender}
      />
      <Card 
        className={classes.root}
        square
        elevation={0}  
      >

        <Grid 
          className={classes.folderContainer}
          container
          direction="row"
          spacing={6}
        >
          {renderFolders()}
        </Grid>

        <div className={classes.fileContainer}>
          {renderFiles()}
        </div>

      </Card>
      <Modal
        data-test="component-fileUpload"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div>
          <FileUpload 
            updateParent={onAddFile}
            credentialType="project_id"
            credential={props.project_id}
            folder_id={props.folder.folder_id}
            maxFiles={4}
            endpoint="/file_system/file"  
          />
        </div>
      </Modal>
    </React.Fragment>
  
  )

}

export default FolderPage