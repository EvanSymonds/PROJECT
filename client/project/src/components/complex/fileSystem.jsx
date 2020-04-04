import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import File from "../basics/file"
import axios from "axios"

const FileSystem = (props) => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    getProjectFiles(2)
  }, [])

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

  const renderFiles = () => {
    return files.map((file, i) => {
        return <File key={i} fileType={file.file_type} fileName={file.file_name} file_id={file.file_id}/>
    })
  }

  return (
    <Card style={{
      direction: "column"
    }}>

      <div>
        {renderFiles()}
      </div>

    </Card>
  )

}

export default FileSystem;