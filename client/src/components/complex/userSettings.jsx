import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import UserDetails from "../basics/userDetails"

const UserSettings = (props) => {

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
        User settings
      </div>
      <UserDetails user={props.user}/>
    </div>

  )

}

export default UserSettings