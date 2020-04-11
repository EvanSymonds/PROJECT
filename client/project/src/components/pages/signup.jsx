import React, { useState } from "react";
import SignupForm from "../complex/signupForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
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

  const onFormComplete = () => {

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
        <SignupForm onSignup={onFormComplete}/>
      </div>
    </Paper>   
  )
}

export default Login;