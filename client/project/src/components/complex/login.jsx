import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import {AccountCircle, Lock, Visibility, VisibilityOff} from "@material-ui/icons"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"

const Login = (props) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 600,
    },
    inputPaper: {
      padding: "2px 4px",
      display: 'flex',
      alignItems: 'center',

      width: 340,
      height: 50,
    },
    inputIcons:{
      color: theme.palette.secondary
    },
    inputDivider:{
      margin: 4,
      height: 40
    },
    input: {
      marginLeft: 5,
      width: 240
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

  const handleSubmit = (e) => {

  }

  return (

      <Paper component="form" onSubmit={handleSubmit} className={classes.root}>
        <Grid container spacing={1} direction="row"  justify="center">
          <Grid item xs={8.5} style={{
            margin: "10px",
          }}>
            <Paper square component="form" className={classes.inputPaper}>
              <AccountCircle color="secondary" fontSize="large" className={classes.inputIcons}/>
              <Divider orientation="vertical" className={classes.inputDivider}/>
              <InputBase required placeholder="Username or email" className={classes.input}/>
            </Paper>
          </Grid>
          <Grid item xs={8.5} style={{
            margin: "10px",
          }}>
            <Paper square component="form" className={classes.inputPaper}>
              <Lock color="secondary" fontSize="large" className={classes.inputIcons}/>
              <Divider orientation="vertical" className={classes.inputDivider}/>
              <InputBase required type={showPassword ? 'text' : 'password'}placeholder="Password" className={classes.input}/>
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
          <Grid item xs={6} align="center" justify="center">
            <div style={{
              margin: "10px",
              display: "inline-block"
            }}>
              <Button variant="text" color="primary">Sign up</Button>
            </div>
          </Grid>
          <Grid item xs={6}align="center" justify="center">
            <div style={{
              margin: "10px",
              display: "inline-block"
            }}>
              <Button type="submit" variant="outlined" color="primary">Login</Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

  )

}

export default Login;