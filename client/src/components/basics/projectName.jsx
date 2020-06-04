import React, { useState, useEffect, useRef } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import Button from "../basics/button"
import axios from "axios"

const ProjectName = (props) => {
  const [projectName, setProjectName] = useState("")
  const [active, setActive] = useState(false)

  const inputRef = React.useRef(null);

  useEffect(() => {
    axios.get("/api/projects/" + props.project_id).then((results) => {
      setProjectName(results.data[0].project_name)
    })
  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      height: 150,
      width: 400,
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    inputPaper: {
      width: 300,
      height: 50,
      backgroundColor: theme.palette.type === "dark" ? null : theme.palette.secondary.light,
      padding: 10,
    },
    input: {
      height: 50,
      fontSize: 20,
      width: 242
    },
    inputText: {
      '&:disabled': {
        color: theme.palette.secondary.contrastText
      }
    }
  }))
  const classes = useStyles()

  const onChange = (event) => {
    setProjectName(event.target.value)
  }

  const onClick = () => {
    if (!active) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100)
      setActive(true)
    } else {
      setActive(false)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setActive(false)

    axios.get("/api/projects/" + props.project_id).then((results, error) => {
      if (error) {
        console.log(error.response)
      } else {

        axios.post("/api/projects/" + props.project_id, {
          project_name: projectName,
          is_public: results.data[0].is_public
        })
      }
    })
  }

  return (

    <Card
      className={classes.root}
    >
      <Paper
        component="form"
        onSubmit={onSubmit}
        square
        elevation={0}
        className={classes.inputPaper}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <InputBase
          inputRef={inputRef}
          disabled={!active}
          value={projectName}
          className={classes.input}
          inputProps={{ style: {textAlign: 'center'}, className: classes.inputText }}
          onChange={onChange}
        />
        <div style={{
          width: props.mode === "admin" ? 48 : 0
        }}>
          {props.mode === "admin" ? <Button
            type="icon"
            icon="Edit"
            variant="contained"
            onClick={onClick}
          /> : null}
        </div>
      </Paper>
    </Card>

  )

}

export default ProjectName