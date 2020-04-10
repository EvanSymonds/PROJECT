import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import {AccountCircle, Email, Lock, Visibility, VisibilityOff} from "@material-ui/icons"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import axios from "axios"
import { Typography } from "@material-ui/core";

const SignupForm = (props) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      padding: 40,
      margin: 50,
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
    }
  }));

  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password1 === password2) {
      console.log("passwords match")
      const formData = new FormData()

      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password1)

      const url = "http://localhost:3001/login/signup"

      await axios.post(url, formData).then((response, error) => {
        console.log(response)
        if (error) {
          console.log(error)
        } else if (response.status === 200){
          console.log(response)
          props.onSignup()
        }
      })
    } else {
      setPasswordsMatch(false)
    }
  }

  const renderPasswordError = () => {
    if (!passwordsMatch) {
      return <Typography color="primary">
        Passwords must match
      </Typography>
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
                <InputBase required onChange={(e) => setUsername(e.target.value)} placeholder="Username" className={classes.input}/>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs style={{
            margin: "10px",
          }}>
            <Grid container direction="row" justify="center">
              <Paper square className={classes.inputPaper}>
                <Email color="secondary" fontSize="large" className={classes.inputIcons}/>
                <Divider orientation="vertical" className={classes.inputDivider}/>
                <InputBase required onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={classes.input}/>
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
                <InputBase required onChange={(e) => setPassword1(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" className={classes.input}/>
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
          <Grid item xs style={{
            margin: "10px",
          }}>
            <Grid container direction="row" justify="center">
              <Paper square className={classes.inputPaper}>
                <Lock color="secondary" fontSize="large" className={classes.inputIcons}/>
                <Divider orientation="vertical" className={classes.inputDivider}/>
                <InputBase required onChange={(e) => setPassword2(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Confirm password" className={classes.input}/>
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
          {renderPasswordError()}
          <Grid item xs={12} align="center" >
            <div style={{
              margin: "20px",
              display: "inline-block",
            }}>
              <Button type="submit" variant="outlined" color="primary">Sign up</Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

  )

}

export default SignupForm;