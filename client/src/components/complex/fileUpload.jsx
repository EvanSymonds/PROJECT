import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios"
import Dropzone from "../basics/dropzone"
import Button from "../basics/button"
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import ProgressBar from "../basics/progressBar"
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from "@material-ui/core/Typography"
import imageCompression from 'browser-image-compression';

const FileUpload = (props) => {
  const [files, setFiles] = useState([])
  const [maxFiles, setMaxFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [successfullyUploaded, setSuccessfullyUploaded] = useState([])
  const [uploadable, setUploadable] = useState(true)
  const [error, setError] = useState("")

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-120px",
      marginLeft: "-300px",
      borderRadius: 110,
      width: 600,
    },
    errorMessage: {
      color: theme.palette.primary.main
    }
  }))
  const classes = useStyles()

  const renderUploadItems = (fileName, progress, i, complete) => {
    return (
      <div key={i}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}>
          <div style={{
            float: "left",
            width: "250px"
          }}>
            <Typography noWrap>
              {fileName}
            </Typography>
            <div style={{
              width: "250px"
            }}>
              <ProgressBar progress={progress}/>
            </div>
          </div>
          {complete ? <CheckCircleOutlineIcon color="secondary"/> : null}
        </div>
      </div>
    )
  }

  const onDrop = (e) => {
    const droppedFiles = Object.keys(e).map(file => file)

    if (files.length + e.length <= props.maxFiles) {
      setError("")
      droppedFiles.forEach((file, i) => {
        console.log(e[i])
        setFiles((files) => [...files, e[i]])
      })
    } else {
      setError(`Maximum of ${props.maxFiles} file${props.maxFiles > 1 ? "s" : ""}`)
    }
  }

  const onUpload = async (e) => {

    setSuccessfullyUploaded(files.map(() => {
      return false
    }))

    await uploadFiles(props.credential)
  }

  const uploadFiles = async (credential) => {

    setUploadable(false)

    return new Promise( async(resolve, reject) => {

      files.forEach(async (file, i) => {

        let compressedFile = file

        if (props.endpoint === "thumbnails") {
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 350,
            useWebWorker: true
          }

          try {
            compressedFile = await imageCompression(compressedFile, options);
          } catch (error) {
            console.log(error);
          }
        } else if (props.endpoint === "profile_pictures") {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 60,
            useWebWorker: true
          }

          try {
            compressedFile = await imageCompression(compressedFile, options);
          } catch (error) {
            console.log(error);
          }
        }

        setSuccessfullyUploaded([...successfullyUploaded, false])

        const config = {
          onUploadProgress: async (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            const copy = {...uploadProgress}
            copy[i] = {
              state: "pending",
              percentage: percentCompleted
            }

            if (percentCompleted === 100 && props.addSkeleton !== undefined) {
              props.addSkeleton(files.length)
            }

            await setUploadProgress((uploadProgress) => {
              return {...uploadProgress, ...copy}
            })
          },
        }
    
        let formData = new FormData()
        formData.append("file", compressedFile)
        formData.append(props.credentialType, credential)
        if (props.folder_id !== undefined) {
          formData.append("folder_id", props.folder_id)
        }

        const url = "/api" + props.endpoint

        await axios.post(url, formData, config).then((response, error) => {
          if (error) {
            reject("Error: ", error)
            setUploadable(true)
          } else {
            if (response.status === 200) {
              let successArray = successfullyUploaded
              successArray[i] = true
              setSuccessfullyUploaded(successArray)

              const isEqualToTrue = (value) => value === true;
              if (successfullyUploaded.length > 0) {
                if (successfullyUploaded.every(isEqualToTrue) === true) {
                  props.updateParent()
                  props.onFileUploaded()
                  resolve()
                }
              }
            }
          }
        })
      })

    })

  }
  

  return (

    <Card
      raised={true} 
      className={classes.root}
    >
      <Grid
        container
        direction="row"
        alignItems="center"
      >
        <Grid
          item
        >
          <Dropzone onDrop={onDrop} disabled={files.length === maxFiles} />
        </Grid>
        <Grid
          item
          style={{
            width: "250px",
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          {files.map((file, i) => renderUploadItems(file.name, uploadProgress[i] ? uploadProgress[i].percentage : 0, i,  uploadProgress[i] ? (uploadProgress[i].percentage === 100 ? true : false) : false))}
          <div
            className={classes.errorMessage}
          >
            {error}
          </div>
        </Grid>
        <Grid
          item
          style={{
            position: "relative",
            left: "50px",
          }}
        >
          <Button data-test="component-uploadButton" size="large" type="icon" icon="CloudUpload" color="primary" onClick={onUpload} disabled={!uploadable}/>
        </Grid>
      </Grid>
    </Card>

  )

}

export default FileUpload