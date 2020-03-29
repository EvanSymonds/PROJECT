import React, { useState } from "react";
import MaterialButton from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import { CloudUpload, Delete, AttachFile } from "@material-ui/icons"

const returnIcon = (icon, size) => {
  if (icon == "CloudUpload") {
    return <CloudUpload fontSize={size}/>
  } else if (icon == "Delete") {
    return <Delete fontSize={size}/>
  } else if (icon == "AttachFile") {
    return <AttachFile fontSize={size}/>
  }
}

const Button = (props) => {
  const type = {
    normal: {
      button: <MaterialButton variant={props.variant} size={props.size} color={props.color} component={props.component}>
      {props.buttonText}
    </MaterialButton>
    },
    normalWithIcon: {
      button: <MaterialButton startIcon={returnIcon(props.icon)} variant={props.variant} size={props.size} color={props.color} component={props.component}>
      {props.buttonText}
    </MaterialButton>
    },
    icon: {
      button: <IconButton component={props.component} color={props.color}>
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