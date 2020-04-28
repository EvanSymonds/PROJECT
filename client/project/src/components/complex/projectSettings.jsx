import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles";
import SelectThumbnail from "../basics/selectThumbnail"
import ProjectName from "../basics/projectName"
import Grid from "@material-ui/core/grid"

var jwt = require("jsonwebtoken")

const ProjectSettings = (props) => {
  const [mode, setMode] = useState("view")

  useEffect(() => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    if (token.authLevel === 9) {
      setMode("admin")
    }
  }, [])

  const useStyles = makeStyles((theme) => ({
    grid: {
      flexGrow: 1,
      width: "100%",
    }
  }))
  const classes = useStyles()

  return (

      <Grid 
        container
        spacing={8}
        className={classes.grid}
        justify="center"
      >
        <Grid item>
          <SelectThumbnail 
            project_id={props.project_id}
            mode={mode}
          />
        </Grid>
        <Grid item>
          <ProjectName 
            project_id={props.project_id}
            mode={mode}
          />
        </Grid>
      </Grid>
    
  )

}

export default ProjectSettings