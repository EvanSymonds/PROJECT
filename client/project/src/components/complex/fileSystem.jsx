import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card"
import FileUpload from "../complex/fileUpload"
import Button from "../basics/button"
import File from "../basics/file"
import axios from "axios"

const FileSystem = (props) => {
  const [files, setFiles] = useState([])
  const [upload, setUpload] = useState(false)

  useEffect(() => {
    getProjectFiles(2)
  }, [])

  useEffect(() => {
    console.log("files update")
  }, [setFiles])

  const getProjectFiles = async (project_id) => {
    const url = "http://localhost:3001/files/project/" + project_id
    await axios.get(url).then((results, error) => {
      if (error) {
        console.log(error)
      } else {
        const filesArray = []
        Object.keys(results.data.rows).map((key) => {
          filesArray.push(results.data.rows[key])
        })
        setFiles(filesArray)
      }
    })
  }

  const onDeleteFile = (e) => {
    setFiles((files) => files.filter((i) => {
      return files.indexOf(i) != e
    }))
  }

  const onAddFile = () => {
    getProjectFiles(2)
    setTimeout(() => {
      setUpload(false)
    }, 500)
  }

  const renderFiles = () => {
    return files.map((file, i) => {
        return <File key={i} fileIndex={i} fileType={file.file_type} fileName={file.file_name} file_id={file.file_id} updateParent={onDeleteFile}/>
    })
  }

  const handleUpload = () => {
    setUpload(true)
  }

  const renderUpload = () => {
    if (upload === true) {
      return <FileUpload updateParent={onAddFile}/>
    }
  }

  return (
    <React.Fragment>
      <Card style={{
        direction: "column"
      }}>

        <div>
          {renderFiles()}
        </div>

      </Card>
      <Button type="normal" variant="contained" buttonText="Upload" color="primary" onClick={handleUpload}/>
      {renderUpload()}
    </React.Fragment>
  )

}

export default FileSystem;