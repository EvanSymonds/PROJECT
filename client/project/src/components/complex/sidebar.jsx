import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Button from "../basics/button"
import Logo from "../basics/logo"
import Drawer from '@material-ui/core/Drawer';
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import Modal from '@material-ui/core/Modal';
import Avater from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';

var jwt = require("jsonwebtoken")

const Sidebar = (props) => {
  const [permanent, setPermanent] = useState(window.innerWidth > 1000 ? true : false)
  const [open, setOpen] = useState(false);
  const [menuItemsList] = useState(["Projects", "Settings", "Support", "Sign out"])

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 250,
    },
    menuItem: {
      color: theme.palette.secondary.dark,
      fontSize: 20,
      marginBottom: 5,
      marginTop: 5,
    },
    menuItemSelected: {
      color: theme.palette.primary.main,
      fontSize: 20,
      marginBottom: 5,
      marginTop: 5,
    },
    drawerPaper: {
      width: 250,
      height: "100%",
      background: theme.palette.secondary.light
    },
    menuButton: {
      display: "absolute",
      zIndex: 1,
    },
    userZone: {
      position: "fixed",
      left: 0,
      top: 0,
      width: 250,
      height: 100,
    },
    avatar: {
      width: 60,
      height: 60,
      marginLeft: 15,
      marginRight: 10,
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

  const renderUserZone = () => {

    if (window.localStorage.getItem("authToken") === null){
      return (
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}>
          <Button type="normal" variant="text" buttonText="Sign up" color="primary" onClick={() => history.push("/signup")}/>
          <Button type="normal" variant="outlined" buttonText="Login" color="primary" onClick={() => history.push("/login")}/>
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
          <Avater className={classes.avatar}/>
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
      return (<Grid item key={i} style={{
        marginTop: 5,
        marginBottom: 5
      }}>
          <Link 
            component="button"
            onClick={() => history.push(`/${itemName.toLowerCase()}`)}
          >
            <Typography variant="body2" className={getLinkColor(itemName)}>
              {itemName}
            </Typography>
          </Link>
        </Grid>
      )
    })

    return (
      <Grid 
        container 
        direction="column"
        style={{
          marginTop: 20,
          marginLeft: 30,
          width: 150
        }}
      >
        <Grid item style={{
          marginBottom: 15
        }}>
          <Logo />
        </Grid>
        {menuItems}
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
              {renderMenuItems()}
            </div>
          </Paper>
        </Drawer>
      )
    } else {
      return (
        <React.Fragment>
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
            </Drawer>
          </Modal>
        </React.Fragment>
      )
    }
  }

  return (
    <div>
      {renderSidebar()}
    </div>
  )

}

export default Sidebar