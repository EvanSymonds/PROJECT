import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/card"
import Slider from '../basics/slider';
import axios from "axios"

import { connect } from "react-redux"
import { changeSettingsAuth } from "../../actions"

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
      height: 150,
      width: 400,
      display: 'flex',
      flexDirection: "center",
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
  }));
  const classes = useStyles()

  const updateSetting = (setting, newValue) => {
    let formData = new FormData()
    formData.append("setting_name", setting)
    formData.append("new_value", newValue)

    console.log(props.project_id)

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
    }
  }

  return (
    <Card 
      className={classes.root}
    >
      <Slider
        title="Change project settings"
        onChange={onSliderChange} setting="changeSettingsAuth"
        default={props.settingsAuth} 
        disabled={mode === "view"}
      />
    </Card>
  )
  
}

const mapStateToProps = state => {
  return { settingsAuth: state.changeSettingsAuth }
}

export default connect(mapStateToProps, { changeSettingsAuth })(AuthSliders)