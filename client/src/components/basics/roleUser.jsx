import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/grid"
import Avatar from "@material-ui/core/avatar"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MuiButton from "@material-ui/core/button"
import Modal from "@material-ui/core/modal"
import Card from "@material-ui/core/card"
import Button from "./button"
import ProfilePicture from "./profilePicture"
import { makeStyles } from '@material-ui/core/styles';
import {ArrowDropDown} from "@material-ui/icons"
import axios from "axios"

var jwt = require("jsonwebtoken")

const RoleUser = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [userId, setUserId] = useState()

  useEffect(() => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    setUserId(token.user_id)
  }, [])

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
    },
    confirm: {
      width: 200,
      height: 150,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-75px",
      marginLeft: "-100px",
    }
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChangeRole(props.user.role_id, event.currentTarget.textContent)
    handleClose()
  };

  const handleDeleteUser = () => {

    let formData = new FormData()
    formData.append("project_id", props.project_id)

    axios.post("/api/roles/delete/" + props.user.role_id, formData).then(() => {
      props.rerender()
      setConfirmOpen(false)
    })
    .catch((error) => {
      console.log(error)
      setConfirmOpen(false)
    })
  }

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
            disableScrollLock
            anchorEl={anchorEl}
            onClose={handleClose}
          >
            {renderMenuItems()}
          </Menu>
        </div> : null}
      {props.onChangeMode === true && props.user.user_id !== userId ?
        <Grid item className={classes.deleteButton}>
          <Button
            type="icon"
            icon="Delete"
            color="primary"
            onClick={() => setConfirmOpen(true)}
          />
        </Grid>
      : null}
      <Modal
        open={confirmOpen}
        disableScrollLock
        onClose={() => setConfirmOpen(false)}
      >
        <div>
          <Card
            className={classes.confirm}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={4}
            >
              <Grid
                item
              >
                <div
                  style={{ fontSize: 15, fontWeight: "bold" }}
                >
                  This action is permanent
                </div>
              </Grid>
              <Grid
                item
              >
                <Button
                  type="normal"
                  variant="contained"
                  buttonText="Remove user"
                  color="primary"
                  onClick={handleDeleteUser}
                />
              </Grid>
            </Grid>
          </Card>
        </div>
      </Modal>
    </Grid>

  )

}

export default RoleUser