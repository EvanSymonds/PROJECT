import React, { useState } from "react"
import Grid from "@material-ui/core/grid"
import Avatar from "@material-ui/core/avatar"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "./button"
import ProfilePicture from "./profilePicture"
import { makeStyles } from '@material-ui/core/styles';

const RoleUser = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const useStyles = makeStyles((theme) => ({
    user: {
      marginLeft: 20,
      marginTop: 20,
    },
    avatar: {
      width: 50,
      height: 50,
    },
    usernameContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 20
    },
    username: {
      fontSize: 20,
      marginBottom: 5,
    }
  }));
  const classes = useStyles();
 
  const renderMenuItems = () => {
    return props.roles.map((role, i) => {
      return (<MenuItem key={i} onClick={handleChange}>
        <div>
          {role.api_role}
        </div>
      </MenuItem>)
    })
  }

  const handleChange = (event) => {
    props.onChangeRole(props.user.role_id, event.currentTarget.textContent)
  };

  const handleClickOpen = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

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
      <Grid item>
        <Button type="icon" icon="Edit" color="primary" onClick={handleClickOpen} />
      </Grid>
      <Menu
        open={open}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {renderMenuItems()}
      </Menu>
    </Grid>

  )

}

export default RoleUser