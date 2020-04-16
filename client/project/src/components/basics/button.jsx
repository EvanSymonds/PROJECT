import React, { useState } from "react";
import MaterialButton from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/styles";
import { CloudUpload, Delete, AttachFile, GetApp, MoreHoriz, Lock, AccountCircle, Menu, Settings, Edit } from "@material-ui/icons"

export const returnIcon = (icon, size) => {
  switch (icon) {
    case "CloudUpload":
      return <CloudUpload fontSize={size}/>
    case "Delete":
      return <Delete fontSize={size}/>
    case "AttachFile":
      return <AttachFile fontSize={size}/>
    case "GetApp":
      return <GetApp fontSize={size}/>
    case "More":
      return <MoreHoriz fontSize={size}/>
    case "Lock":
      return <Lock fontSize={size}/>
    case "AccountCircle":
      return <AccountCircle fontSize={size}/>
    case "Menu":
      return <Menu fontSize={size}/>
    case "Settings":
      return <Settings fontSize={size}/>
    case "Edit":
      return <Edit fontSize={size}/>
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
    <div
      data-test='component-button'
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {style.button}
    </div>
  )

}

export default Button;