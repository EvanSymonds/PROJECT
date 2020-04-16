import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card"
import Divider from '@material-ui/core/Divider';
import Modal from '@material-ui/core/Modal';
import FileUpload from "../complex/fileUpload"
import Button from "../basics/button"
import File from "../basics/file"
import axios from "axios"

const FileSystem = (props) => {
  const [files, setFiles] = useState([])
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      
    }
  }))

  const classes = useStyles()

  useEffect(() => {getProjectFiles(props.project_id)}, [])

  const getProjectFiles = async (project_id) => {

    const url = "http://localhost:3001/files/project/" + project_id
    await axios.get(url).then((results, error) => {
      if (error) {
        console.log(error)
      } else {
        if (results.status === 200) {
          const filesArray = []
          Object.keys(results.data.rows).map((key) => {
            filesArray.push(results.data.rows[key])
          })
          setFiles(filesArray)
        }
      }
    })
  }

  const onDeleteFile = (e) => {
    setFiles((files) => files.filter((i) => {
      return files.indexOf(i) != e
    }))
  }

  const onAddFile = () => {
    getProjectFiles(props.project_id)  
  }

  const renderFiles = () => {
    return files.map((file, i) => {
        if (files.length === i + 1){
          return (
            <div key={i} data-testid='component-file'>
              <File key={i} fileIndex={i} fileType={file.file_type} fileName={file.file_name} file_id={file.file_id} updateParent={onDeleteFile}/>
            </div>
          )
        } else {
          return (
            <div key={i} data-testid='component-file'>
              <File key={i} fileIndex={i} fileType={file.file_type} fileName={file.file_name} file_id={file.file_id} updateParent={onDeleteFile}/>
              <Divider light key={"divider"+i}/>
            </div>
          )
        }
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Card className={classes.root} style={{
        direction: "column",
      }}>

        <div>
          {renderFiles()}
        </div>

      </Card>
      <Button data-test="component-showUploaderButton" type="normal" variant="contained" buttonText="Upload" color="primary" onClick={handleOpen}/>
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
            maxFiles={4}
            endpoint="/files"  
          />
        </div>
      </Modal>
    </React.Fragment>
  )

}

export default FileSystem;