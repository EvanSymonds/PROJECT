import React, { useState } from "react";
import MaterialButton from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/styles";
import { CloudUpload, Delete, AttachFile, GetApp } from "@material-ui/icons"

const returnIcon = (icon, size) => {

  if (icon === "CloudUpload") {
    return <CloudUpload fontSize={size}/>
  } else if (icon === "Delete") {
    return <Delete fontSize={size}/>
  } else if (icon === "AttachFile") {
    return <AttachFile fontSize={size}/>
  } else if (icon === "GetApp") {
    return <GetApp fontSize={size}/>
  }
}

const Button = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.secondary.main,
      
      '&$disabled': {
        color: theme.palette.secondary.light
      },
    },
    backgroundPrimary: {
      backgroundColor: theme.palette.primary,
    },
    useOther: {},
    disabled: {},
  }))

  const getClasses = () => {
    if (!props.color) {
      return classes.root
    } else if (props.backgroundColor === "primary") {
      return classes.backgroundPrimary
    } else {
      return classes.useOther
    }
  }
  const classes = useStyles()

  const type = {
    normal: {
      button: <MaterialButton classes={{
        root: getClasses(),
        disabled: classes.disabled
        }}  disabled={props.disabled} onClick={props.onClick} variant={props.variant} size={props.size} color={props.color} component={props.component}>
      {props.buttonText}
    </MaterialButton>
    },
    normalWithIcon: {
      button: <MaterialButton classes={{
        root: getClasses(),
        disabled: classes.disabled
        }} disabled={props.disabled} onClick={props.onClick} startIcon={returnIcon(props.icon)} variant={props.variant} size={props.size} color={props.color} component={props.component}>
      {props.buttonText}
    </MaterialButton>
    },
    icon: {
      button: <IconButton classes={{
        root: getClasses(),
        disabled: classes.disabled
        }} disabled={props.disabled} onClick={props.onClick} component={props.component} color={props.color}>
        {returnIcon(props.icon, props.size)}
      </IconButton>
    }
  }

  const style = type[props.type]

  return(
    <React.Fragment>
      {style.button}
    </React.Fragment>
  )

}

export default Button;