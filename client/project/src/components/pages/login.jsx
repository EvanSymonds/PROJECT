import React, { useState } from "react";
import LoginForm from "../complex/loginForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const Login = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)

  const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: 16,
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
      height: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "100%"
    }
  }));
  const classes = useStyles();
  const history = useHistory();

  const onLogin = (token) => {
    window.localStorage.setItem("authToken", token)
    history.push("/")
    window.location.reload(false);
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
      <div className={classes.page}>
        <LoginForm onLogin={onLogin} onSignup={onClickSignup}/>
      </div>
    </Paper> 
  )
}

export default Login;