import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Button from "../basics/button"
import Logo from "../basics/logo"
import Drawer from '@material-ui/core/Drawer';
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import Modal from '@material-ui/core/Modal';
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';
import ProfilePicture from "../basics/profilePicture"

var jwt = require("jsonwebtoken")

const Sidebar = (props) => {
  const [permanent, setPermanent] = useState(window.innerWidth > 1000 ? true : false)
  const [open, setOpen] = useState(false);
  const [menuItemsList] = useState(["Projects", "Settings", "Support"])

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 250,
      display: "inline"
    },
    itemText: {
      color: theme.palette.secondary.dark,
      fontSize: 20,
      marginLeft: 30,
    },
    menuItem: {
      backgroundColor: theme.palette.secondary.light,
      height: 50,
      display: "flex",
      alignItems: "center",
      cursor: 'pointer',
      "&:hover": {
        background: theme.palette.secondary.menuGradient
      }
    },
    menuItemSelected: {
      background: theme.palette.secondary.menuGradient,
      height: 50,
      display: "flex",
      alignItems: "center",
      cursor: 'pointer',
      "&:hover": {
        background: theme.palette.secondary.menuGradient
      }
    },
    drawerPaper: {
      width: 250,
      height: "100%",
      background: theme.palette.secondary.light
    },
    menuButton: {
      display: "inline",
      width: 48,
    },
    userZone: {
      width: 250,
      height: 100,
    },
    avatar: {
      width: 60,
      height: 60,
      marginLeft: 15,
      marginRight: 10,
    },
    profilePicture: {
      width: 60,
      height: 60,
    },
    username: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: 116,
    }
  }));
  const classes = useStyles();
  const history = useHistory()

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth <= 1000) {
      setPermanent(false)
      props.onResize()
    } else if (window.innerWidth > 1000) {
      setPermanent(true)
      props.onResize()
    }
  }
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signOut = () => {
    window.localStorage.removeItem("authToken")
    history.push("/")
  }

  const renderSignOut = () => {
    if (window.localStorage.getItem("authToken") !== null){
      return (
      <div style={{
        marginTop: 10
      }}>
        <Button type="normal" variant="outlined" buttonText="Sign out" onClick={signOut} color="primary" />
      </div>
      )
    }
  }

  const renderUserZone = () => {

    if (window.localStorage.getItem("authToken") === "undefined" || !window.localStorage.getItem("authToken")){
      return (
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}>
          <div style={{
            margin: 10
          }}>
            <Button type="normal" variant="text" buttonText="Sign up" color="primary" onClick={() => history.push("/signup")}/>
          </div>
          <div style={{
            margin: 10
          }}>
            <Button type="normal" variant="outlined" buttonText="Login" color="primary" onClick={() => history.push("/login")}/>
          </div>
        </div>
      )
    } else {
      const encrypted = window.localStorage.getItem("authToken")
      const token = jwt.decode(JSON.parse(encrypted))

      const username = token.name.substr(0, token.name.length - 5)
      const usernameNumber = token.name.substr(token.name.length - 5)

      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          height: 100,
        }}>
          <Avatar className={classes.avatar}>
            <ProfilePicture user_id={token.user_id} width={60} height={60}/>
          </Avatar>
          <div className={classes.username}>
            <Typography noWrap style={{
              display: "block",
              fontWeight: "bold",
              fontSize: 14,
            }} variant="h6">{username}</Typography>
            <Typography color="primary" style={{
              display: "block"
            }} variant="caption">{usernameNumber}</Typography>
          </div>
          <Button type="icon" icon="Settings" onClick={() => history.push("/settings")} color="primary"/>
        </div>
      )
    }
  }

  const getLinkColor = (itemName) => {
    const path = window.location.pathname.split("/")

    if (itemName.toLowerCase() === path[1]) {
      return classes.menuItemSelected
    } else {
      return classes.menuItem
    }
  }

  const renderMenuItems = () => {

    const menuItems = menuItemsList.map((itemName, i) => {
      return (
        <Paper 
          square
          key={i}
          className={getLinkColor(itemName)}
          elevation={0}
          onClick={() => history.push(`/${itemName.toLowerCase()}`)}
        >
          <Typography variant="body2" className={classes.itemText}>
            {itemName}
          </Typography>
        </Paper>
      )
    })

    return (
      <Grid 
        container 
        direction="column"
      >
        <Grid item style={{
          marginBottom: 15,
          marginTop: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <Logo />
        </Grid>
        <Grid item>
          {menuItems}
        </Grid>
      </Grid>
    )
  }

  const renderSidebar = () => {
    if (permanent) {
      return (
        <Drawer
          className={classes.root}
          variant="permanent"
          anchor="left"
        >
          <Paper square className={classes.drawerPaper}>
            <div className={classes.userZone}>
              {renderUserZone()}
              <Divider variant="middle" />
            </div>
            <div>
              {renderMenuItems()}
            </div>
            <div style={{
                position: "absolute",
                width: 250,
                bottom: 10,
                display: "flex",
                justifyContent: "center"
              }}>
                {renderSignOut()}
              </div>
          </Paper>
        </Drawer>
      )
    } else {
      return (
        <div style={{
          width: 48,
          display: "inline",
        }}>
          <Button className={classes.menuButton} type="icon" icon="Menu" color="primary" onClick={handleOpen}/>
          <Modal
            open={open}
            onClose={handleClose}
          >
            <Drawer
              className={classes.root}
              variant="permanent"
              anchor="left"
            >
              <Paper square className={classes.drawerPaper}>
                <div className={classes.userZone}>
                  {renderUserZone()}
                  <Divider variant="middle" />
                  {renderMenuItems()}
                </div>
              </Paper>
              <div style={{
                position: "absolute",
                width: 250,
                bottom: 10,
                display: "flex",
                justifyContent: "center",
              }}>
                {renderSignOut()}
              </div>
            </Drawer>
          </Modal>
        </div>
      )
    }
  }

  return (
    <div style={{
      width: 48,
      display: "inline",
    }}>
      {renderSidebar()}
    </div>
  )

}

export default Sidebar