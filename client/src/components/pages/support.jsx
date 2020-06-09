import React, { useState, useEffect } from "react";
import SupportForm from "../complex/supportForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import Button from "../basics/button"
import socketIOClient from "socket.io-client";

var jwt = require("jsonwebtoken")

const Support = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  useEffect(() => {
    const socket = socketIOClient("http://cratelab.herokapp.com")
    socket.on("PROJECT_INVITE", (data) => {
      if (window.localStorage.getItem("authToken")) {
        const encrypted = window.localStorage.getItem("authToken")
        const token = jwt.decode(JSON.parse(encrypted))

        if (parseInt(token.user_id) === data) {
          setNotificationOpen(true)
        }
      }
    });
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
      display: "flex",
      justifyContent: "center",
      paddingTop: 50,
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
        <SupportForm />
      </div>
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
      >
        <Paper
          className={classes.notification}
        >
          <div
            style={{
              fontSize: 15,
              marginRight: 15
            }}
          >
            New project invite!
          </div>
          <Button
            type="icon"
            icon="Close"
            onClick={() => setNotificationOpen(false)}
          />
        </Paper>
      </Snackbar>
    </Paper> 
  )
}

export default Support