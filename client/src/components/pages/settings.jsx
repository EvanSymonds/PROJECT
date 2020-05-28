import React, { useState, useEffect } from "react";
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import SiteSettings from "../complex/siteSettings"
import UserSettings from "../complex/userSettings"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

var jwt = require("jsonwebtoken")

const Settings = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [user, setUser] = useState()

  useEffect(() => {
    if (!window.localStorage.getItem("authToken")) {
      setUser(null)
    } else {
      const encrypted = window.localStorage.getItem("authToken")
      const token = jwt.decode(JSON.parse(encrypted))

      setUser({
        username: token.name,
        user_id: token.user_id
      })
    }
  }, [])

  const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: 16,
        backgroundColor: theme.palette.background.default,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.secondary.main,
        width: 6,
        border: "4px solid rgba(0, 0, 0, 0)",
        backgroundClip: "padding-box",
        borderRadius: 10
      }
    },
    page: {
      marginLeft: permanentSidebar ? 250 : 0,
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "calc(100% + 10px)"
    }
  }));
  const classes = useStyles();
  const history = useHistory();


  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }


  return (
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.page}>
        <SiteSettings />
        {user !== undefined && user !== null ? <UserSettings user={user}/> : null}
      </div>
    </Paper> 
  )
}

export default Settings