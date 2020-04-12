import React, { useState } from "react";
import SignupForm from "../complex/signupForm"
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
    },
    background:{
      height: window.innerHeight,
    }
  }));
  const classes = useStyles();
  const history = useHistory();

  const onFormComplete = (token) => {
    window.localStorage.setItem("authToken", token)
    history.push("/")
  }

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }

  return(
    <div className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.root}>
        <SignupForm onSignup={onFormComplete}/>
      </div>
    </div>   
  )
}

export default Login;