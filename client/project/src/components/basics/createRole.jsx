import React, { useState } from "react"
import Card from "@material-ui/core/card"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import axios from "axios"

const CreateRole = (props) => {
  const [roleName, setRoleName] = useState("")

  const onChange = (event) => {
    setRoleName(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    console.log(parseInt(props.project_id))

    let formData = new FormData()
    formData.append("project_id", parseInt(props.project_id))
    formData.append("role_name", roleName)

    console.log(roleName)

    axios.post("http://localhost:3001/roles/new", formData).then((results) => {
      props.onAddRole(roleName)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (

    <Card
      style={{
        position: "absolute",
        width: 300,
        height: 200,
        left: "50%",
        top: "50%",
        marginLeft: -150,
        marginTop: -105,
        
      }}
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
            label="Role name"
            variant="filled"
            color="primary"
            value={roleName}
            onChange={onChange}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{  }}
        >
          Create role
        </Button>
      </form>
    </Card>

  )

}

export default CreateRole