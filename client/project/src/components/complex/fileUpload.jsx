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

  const renderCompleteIcon = () => {
    if (props.complete === true) {
      return <CheckCircleOutlineIcon color="secondary"/>
    }
  }

  const renderUploadItems = (fileName, progress, i, complete) => {
    return (
      <React.Fragment key={i}>
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
      </React.Fragment>
    )
  }

  const onDrop = (e) => {
    if (files.length === 3) {
      setMaxFiles(true)
    }

    setFiles([...files, e[0]])
  }

  const onUpload = async (e) => {
    await uploadFiles(2).then((results) => {
      console.log(results)
    })
  }

  useEffect(() => {
    files.map((file, i) => {
      console.log(uploadProgress)
    })
  }, [uploadProgress])

  const uploadFiles = async (project_id) => {

    return new Promise( async(resolve, reject) => {

      files.map( async (file, i) => {
        const config = {
          onUploadProgress: async (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            const copy = {...uploadProgress}
            console.log(copy)
            console.log(i)
            copy[i] = {
              state: "pending",
              percentage: percentCompleted
            }
            await setUploadProgress((uploadProgress) => {
              return {...uploadProgress, ...copy}
            })
          },
        }
    
        let formData = new FormData()
        formData.append("file", file)
        formData.append("project_id", project_id)

        await axios.post("http://localhost:3001/files", formData, config).then((response, error) => {
          if (error) {
            reject("Error: ", error)
          } else {
            resolve(response)
          }
        })
      })
    })
  }
  

  return (

    <ThemeProvider theme={useTheme()}>
      <Card raised={true} style={{
        margin: "10px",
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
          <Button size="large" type="icon" icon="CloudUpload" color="primary" onClick={onUpload} />
        </div>
      </Card>
    </ThemeProvider>

  )

}

export default FileUpload