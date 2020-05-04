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

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "90%",
      marginLeft: 10
    },
    folderContainer: {
      marginLeft: 30
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              />
            </div>
          )
        } else {
          return (
            <div key={i}>
              <div 
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
                />
              </div>
              <Divider light key={"divider"+i}/>
            </div>
          )
        }
    })
  }

  const handleEnterFolder = (folder_id) => {
    let folder_name

    props.folder.folders.forEach((childFolder) => {
      if (childFolder.folder_id === folder_id) {
        folder_name = childFolder.folder_name
      }
    })

    props.handleEnterFolder(folder_id, folder_name)
  }

  const renderFolders = () => {
    return props.folder.folders.map((folder, i) => {
      return (
        <Grid
          item
          key={i}
        >
          <Folder
            folder_name={folder.folder_name}
            handleEnterFolder={handleEnterFolder}
            folder_id={folder.folder_id}
          />
        </Grid>
      )
    })
  }

  return (

    <React.Fragment>
      <FileSystemMenu onClickUpload={handleOpen} onCreateFolder={onCreateFolder}/>
      <Breadcrumbs ancestry={props.ancestry} onReturn={props.onReturn}/>
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
        onClose={handleClose}
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