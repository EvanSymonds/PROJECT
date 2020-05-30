import React, { useState } from "react"
import Grid from "@material-ui/core/grid"
import Avatar from "@material-ui/core/avatar"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MuiButton from "@material-ui/core/button"
import Button from "./button"
import ProfilePicture from "./profilePicture"
import { makeStyles } from '@material-ui/core/styles';
import {ArrowDropDown} from "@material-ui/icons"

const RoleUser = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const useStyles = makeStyles((theme) => ({
    user: {
      margin: "10px 0px 10px 20px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
    },
    usernameContainer: {
      display: "flex",
      alignItems: "center",
      marginLeft: 20,
      height: 50,
      width: 'calc(100% - 320px)'
    },
    username: {
      fontSize: 20,
      marginBottom: 5,
    },
    button: {
      width: 200,
      padding: "5px 0px 5px 5px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      display: "flex",
      justifyContent: "left",
    },
    buttonText: {
      width: 160,
      overflow: "hidden",
      textAlign: "left"
    }
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChangeRole(props.user.role_id, event.currentTarget.textContent)
    handleClose()
  };

  const handleClickOpen = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const renderMenuItems = () => {
    return props.roles.map((role, i) => {
      if (role.api_role !== "change_role"){
        return (<MenuItem key={i} onClick={handleChange}>
          <div>
            {role.api_role}
          </div>
        </MenuItem>)
      }
    })
  }

  return (

    <Grid
      className={classes.user}
      container
    >
      <Grid item>
        <Avatar className={classes.avatar}>
          <ProfilePicture user_id={props.user.user_id} width={50} height={50} />
        </Avatar>
      </Grid>
      <Grid item className={classes.usernameContainer}>
        <div className={classes.username}>
          {props.user.username}
        </div>
      </Grid>
      {props.onChangeMode === true ? <div>
          <Grid item>
            <MuiButton 
              className={classes.button}
              color="primary"
              variant="outlined"
              onClick={handleClickOpen}
              endIcon={<ArrowDropDown />}
            >
              <div className={classes.buttonText}>
                {props.userRole}
              </div>
            </MuiButton>
          </Grid>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
          >
            {renderMenuItems()}
          </Menu>
        </div> : null}
      {props.onChangeMode === true ?
        <Grid item className={classes.deleteButton}>
          <Button
            type="icon"
            icon="Delete"
            color="primary"
          />
        </Grid>
      : null}
    </Grid>

  )

}

export default RoleUser