import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import {AccountCircle, Lock, Visibility, VisibilityOff} from "@material-ui/icons"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import axios from "axios"

const LoginForm = (props) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showError, setShowError] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      padding: 40,
      background: theme.palette.secondary.light
    },
    inputPaper: {
      padding: "2px 4px",
      display: 'flex',
      alignItems: 'center',

      width: 340,
      height: 50,
    },
    inputIcons:{
      
    },
    inputDivider:{
      margin: 4,
      height: 40
    },
    input: {
      marginLeft: 5,
      width: 240,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderError = () => {
    if (showError === true) {
      return (<Typography color="primary">
          Username or password incorrect
        </Typography>
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData()

    formData.append("credential", username)
    formData.append("password", password)

    const url = "/api/auth"

    try {
      await axios.post(url, formData).then((response) =>{
        if (response.status === 200){
          const token = JSON.stringify(response.headers["x-auth-token"])
          props.onLogin(token)
        }
      })
    }
    catch (error) {
      if (error.message.substr(error.message.length - 3) === "401") {
        setShowError(true)
      }
    }
  }

  return (

      <Paper component="form" onSubmit={handleSubmit} className={classes.root}>
        <Grid direction="row" justify="center" container spacing={1}>
          <Grid item xs style={{
            margin: "10px",
          }}>
            <Grid container direction="row" justify="center">
              <Paper square className={classes.inputPaper}>
                <AccountCircle color="secondary" fontSize="large" className={classes.inputIcons}/>
                <Divider orientation="vertical" className={classes.inputDivider}/>
                <InputBase required onChange={(e) => setUsername(e.target.value)} placeholder="Username or email" className={classes.input}/>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs style={{
            margin: "10px",
          }}>
            <Grid container direction="row" justify="center">
              <Paper square className={classes.inputPaper}>
                <Lock color="secondary" fontSize="large" className={classes.inputIcons}/>
                <Divider orientation="vertical" className={classes.inputDivider}/>
                <InputBase required onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" className={classes.input}/>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Paper>
            </Grid>
          </Grid>
          {renderError()}
          <Grid item xs={6} align="center" >
            <div style={{
              marginTop: "20px",
              display: "inline-block",
            }}>
              <Button onClick={props.onSignup} variant="text" color="primary">Sign up</Button>
            </div>
          </Grid>
          <Grid item xs={6}align="center" >
            <div style={{
              marginTop: "20px",
              display: "inline-block"
            }}>
              <Button type="submit" variant="outlined" color="primary">Login</Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

  )

}

export default LoginForm;