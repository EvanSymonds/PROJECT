import React from "react"
import { makeStyles } from "@material-ui/styles";
import { useTheme } from '@material-ui/core/styles';

const AuthorisationMarker = (props) => {

  const theme = useTheme()

  const useStyles = makeStyles((theme) => ({
    image: {
      width: 45,
      height: 45
    }
  }))
  const classes = useStyles()

  const getImageSource = () => {

    switch (theme.palette.type){
      case "light":
        return "/static/images/authorisation-" + props.level + ".svg"
      case "dark":
        return "/static/images/authorisation-" + props.level + "-dark.svg"
    }
  }

  return (

    <img
      id={props.markerId}
      className={classes.image}
      src={getImageSource()}
    />

  )

}

export default AuthorisationMarker