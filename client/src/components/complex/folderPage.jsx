import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles";
import Breadcrumbs from "../basics/breadcrumbs"
import FileSystemMenu from "./fileSystemMenu"
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import FileUpload from "../complex/fileUpload"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Description, Folder } from "@material-ui/icons"
import File from "../basics/file"
import FolderComponent from "../basics/folder"
import axios from "axios"

const initialState = {
  mouseX: null,
  mouseY: null,
};

const FolderPage = (props) => {
  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listenForDrag, setListenForDrag] = useState(false)
  const [skeletons, setSkeletons] = useState([])

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "95%",
      height: "100%",
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

  const selectFile = (file_id) => {
    console.log(file_id)
    setSelectedFile(file_id)
  }

  const handleFileUploaded = () => {
    const skeletonCopy = [...skeletons]
    skeletonCopy.shift()
    setSkeletons(skeletonCopy)
  }

  const handleAddSkeletonFile = (maxFiles) => {
    if (skeletons.length < maxFiles) {
      setSkeletons((skeletons) => [...skeletons, 0])
    }
  }

  const onCreateFolder = () => {
    handleClose()

    let formData = new FormData()
    formData.append("project_id", props.project_id)
    formData.append("folder_id", props.folder.folder_id)

    axios.post("/api/file_system/folder", formData).then(() => {
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

    axios.post("/api/file_system/delete/" + folder_id, formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleOpen = () => {
    setOpen(true);
    handleClose()
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

    axios.post("/api/file_system/auth/" + selected.folder_id, formData).then(() => {
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

  const handleClick = (event) => {
    event.preventDefault();

    if (event !== undefined) {
      if (event.target.id !== "folder-element" && event.target.parentNode.id !== "folder-element" && event.target.id !== "file-element" && event.target.parentNode.id !== "file-element") {
        setState({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      }
    }
  };

  const handleClose = () => {
    setState(initialState);
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
                selected={selectedFile}
                selectFile={selectFile}
                type="normal"
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
                  type="normal"
                  selected={selectedFile}
                  selectFile={selectFile}
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

    axios.post("/api/file_system/color/" + selected.folder_id, formData).then(() => {
      props.rerender()
      setSelected(null)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleEnterFolder = (folder_id, authorisation_level) => {
    setSelected(null)

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
          <FolderComponent
            listenForDrag={listenForDrag}
            onAddAuth={onAddAuth}
            onColorChange={onColorChange}
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
            selectedFolder={selected}
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
        onContextMenu={handleClick}
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
          {skeletons.map((skeleton, i) => 
            <File
              type="skeleton"
              key={i}
            />
          )}
          {renderFiles()}
        </div>

      </Card>
      <Modal
        data-test="component-fileUpload"
        open={open}
        onClose={() => setOpen(false)}
        disableScrollLock
      >
        <div>
          <FileUpload 
            updateParent={onAddFile}
            onFileUploaded={handleFileUploaded}
            addSkeleton={handleAddSkeletonFile}
            credentialType="project_id"
            credential={props.project_id}
            folder_id={props.folder.folder_id}
            maxFiles={5}
            endpoint="/file_system/file"  
          />
        </div>
      </Modal>
      <Menu
        keepMounted
        disableScrollLock
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem 
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
          onClick={handleOpen}
        >
          <Description style={{ marginRight: 10 }}/>
          Add file
        </MenuItem>
        <MenuItem 
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
          onClick={onCreateFolder}
        >
          <Folder style={{ marginRight: 10 }}/>
          Add folder
        </MenuItem>
      </Menu>
    </React.Fragment>
  
  )

}

export default FolderPage