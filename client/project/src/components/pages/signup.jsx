import React, { useState } from "react";
import SignupForm from "../complex/signupForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const Login = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [width, setWidth] = React.useState(window.innerWidth);

  const useStyles = makeStyles((theme) => ({
    page: {
      height: window.innerHeight - 96,
      marginLeft: permanentSidebar ? 250 : 0,
      marginTop: permanentSidebar ? 48 : 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: width,
      height: "100%"
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
      setWidth(window.innerWidth)
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setWidth(window.innerWidth)
      setPermanentSidebar(true)
    }
  }

  return(
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.page}>
        <SignupForm onSignup={onFormComplete}/>
      </div>
    </Paper>   
  )
}

export default Login;