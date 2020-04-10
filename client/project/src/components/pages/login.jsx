import React, { useState } from "react";
import LoginForm from "../complex/loginForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const Login = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)

  const useStyles = makeStyles((theme) => ({
    root: {
      height: permanentSidebar ? window.innerHeight : window.innerHeight - 96,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0
    },
    background:{
      height: window.innerHeight,
    }
  }));
  const classes = useStyles();

  const history = useHistory();

  const onLogin = () => {
    console.log("LOGGED IN")
  }

  const onClickSignup = () => {
    history.push("/signup")
  }

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }

  return(
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.root}>
        <LoginForm onLogin={onLogin} onSignup={onClickSignup}/>
      </div>
    </Paper> 
  )
}

export default Login;