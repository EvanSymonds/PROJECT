import React, { useEffect, useState } from "react";
import axios from "axios"
import Dropzone from "../basics/dropzone"
import Button from "../basics/button"
import Card from "@material-ui/core/card"
import ProgressBar from "../basics/progressBar"
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from "@material-ui/core/Typography"
import { useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/core/styles"

const FileUpload = (props) => {
  const [files, setFiles] = useState([])
  const [maxFiles, setMaxFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [successfullyUploaded, setSuccessfullyUploaded] = useState([])
  const [uploadable, setUploadable] = useState(true)

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
    let tempLength = files.length

    setFiles([...files, e[0]])

    if (tempLength + 1 === props.maxFiles) {
      setMaxFiles(true)
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
        formData.append("file", file)
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
    <div data-test="component-fileUpload">
      <ThemeProvider theme={useTheme()}>
        <Card raised={true} style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-120px",
          marginLeft: "-300px",
          borderRadius: 110,
          width: 600,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}>
          <div style={{
            float: "left",
          }}>
            <Dropzone onDrop={onDrop} disabled={maxFiles} />
          </div>

          <div style={{
            width: "250px",
            marginBottom: "30px",
            marginTop: "20px",
          }}>
            {files.map((file, i) => renderUploadItems(file.name, uploadProgress[i] ? uploadProgress[i].percentage : 0, i,  uploadProgress[i] ? (uploadProgress[i].percentage === 100 ? true : false) : false))}
          </div>
          
          <div style={{
            position: "relative",
            left: "50px",
          }}>
            <Button data-test="component-uploadButton" size="large" type="icon" icon="CloudUpload" color="primary" onClick={onUpload} disabled={!uploadable}/>
          </div>
        </Card>
      </ThemeProvider>
    </div>
  )

}

export default FileUpload