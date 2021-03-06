import React, { useState } from "react"
import Card from "@material-ui/core/Card"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios"

const RenameFolder = (props) => {
  const [folderName, setFolderName] = useState(props.defaultValue)

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "absolute",
        width: 300,
        height: 200,
        left: "50%",
        top: "50%",
        marginLeft: -150,
        marginTop: -105,
    }
  }))
  const classes = useStyles()

  const onChange = (event) => {
    setFolderName(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    let formData = new FormData()
    formData.append("new_name", folderName)

    axios.post("/api/folders/" + props.folder_id, formData).then(() => {
      props.close()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (

    <Card
      className={classes.root}
    >
      <form onSubmit={onSubmit} style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
      }}>
        <div style={{
          marginBottom: 40
        }}>
          <TextField 
            label="Folder name"
            variant="filled"
            color="primary"
            value={folderName}
            onChange={onChange}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Rename
        </Button>
      </form>
    </Card>

  )

}

export default RenameFolder