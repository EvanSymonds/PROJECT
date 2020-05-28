import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/card"
import Typography from "@material-ui/core/Typography"
import Slider from '../basics/slider';
import axios from "axios"

import { connect } from "react-redux"
import { changeSettingsAuth, editFilesAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const AuthSliders = (props) => {
  const [mode, setMode] = useState("view")

  useEffect(() => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    if (token.authLevel === 9) {
      setMode("admin")
    }
  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      height: 200,
      width: 400,
      padding: 15,
      display: 'flex',
      flexDirection: "column",
      justifyContent: "center",
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    title: {
      marginLeft: 5,
      marginBottom: 10,
    }
  }));
  const classes = useStyles()

  const updateSetting = (setting, newValue) => {
    let formData = new FormData()
    formData.append("setting_name", setting)
    formData.append("new_value", newValue)

    axios.post("http://localhost:3001/project_settings/" + props.project_id, formData)
    .catch((error) => {
      console.log(error)
    })
  }

  const onSliderChange = (setting, value) => {
    switch (setting) {
      case "changeSettingsAuth":
        updateSetting(setting, value)
        props.changeSettingsAuth(value)
        return
      case "editFilesAuth":
        updateSetting(setting, value)
        props.editFilesAuth(value)
        return
    }
  }

  return (
    <Card 
      className={classes.root}
    >
      <Typography variant="h6" className={classes.title}>
        Authorisation level needed to:
      </Typography>
      <Slider
        title="Change project settings"
        onChange={onSliderChange} setting="changeSettingsAuth"
        default={props.projectSettings.changeSettingsAuth} 
        disabled={mode === "view"}
      />
      <Slider
        title="Edit file system"
        onChange={onSliderChange}
        setting="editFilesAuth"
        default={props.projectSettings.editFilesAuth} 
        disabled={mode === "view"}
      />
    </Card>
  )
  
}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth, editFilesAuth })(AuthSliders)