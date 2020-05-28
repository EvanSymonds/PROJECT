import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import ThemeChooser from "../basics/themeChooser"
import UserDetails from "../basics/userDetails"
import Divider from "@material-ui/core/divider"

const SiteSettings = () => {

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: 50,
      marginLeft: 50,
    },
    titleText: {
      color: theme.palette.primary.main,
      fontSize: 25,
      marginBottom: 20,
      marginTop: 20
    }
  }));
  const classes = useStyles();

  return (

    <div className={classes.root}>
      <div className={classes.titleText}>
        Site settings
      </div>
      <Divider variant="middle" />
      <ThemeChooser />
      <Divider variant="middle" />
    </div>

  )

}

export default SiteSettings