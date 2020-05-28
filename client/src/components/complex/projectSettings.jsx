import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles";
import SelectThumbnail from "../basics/selectThumbnail"
import ProjectName from "../basics/projectName"
import AuthSliders from "./authSliders"
import DeleteProject from "../basics/deleteProject"
import Grid from "@material-ui/core/grid"

import { connect } from "react-redux"
import { changeSettingsAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const ProjectSettings = (props) => {
  const [mode, setMode] = useState("view")

  useEffect(() => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    if (token.authLevel >= props.projectSettings.changeSettingsAuth) {
      setMode("admin")
    }
  }, [])

  const useStyles = makeStyles((theme) => ({
    grid: {
      flexGrow: 1,
      width: "100%",
      marginTop: 48
    }
  }))
  const classes = useStyles()

  return (

      <Grid 
        container
        spacing={8}
        className={classes.grid}
        style={{ marginLeft: 50, width: "calc(100% - 50px)" }}
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
        <Grid item>
          <DeleteProject 
            project_id={props.project_id}
          />
        </Grid>
        <Grid item>
          <AuthSliders project_id={props.project_id}/>
        </Grid>
      </Grid>
    
  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth })(ProjectSettings)