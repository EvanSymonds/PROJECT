import React, { useEffect, useState } from "react";
import axios from "axios"
import Dropzone from "../basics/dropzone"
import UploadItem from "./uploadItem"
import Button from "../basics/button"
import Card from "@material-ui/core/card"
import { CloudUpload } from "@material-ui/icons"
import { useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/core/styles"

const FileUpload = (props) => {
  const [files, setFiles] = useState([])
  const [maxFiles, setMaxFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

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
          {files.map((file, i) => <UploadItem key={i} progress={uploadProgress[i] ? uploadProgress[i].percentage : 0} fileName={file.name} complete={uploadProgress[i] ? (uploadProgress[i].percentage === 100 ? true : false) : false}/>)}
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