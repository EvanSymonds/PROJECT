import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import Paper from "@material-ui/core/Paper"
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from "@material-ui/core/Divider"
import Modal from "@material-ui/core/Modal"
import Button from "../basics/button"
import MuiButton from "@material-ui/core/Button"
import InputBase from "@material-ui/core/InputBase"
import CreateRole from "../basics/createRole"
import { Edit, Add } from "@material-ui/icons"
import socketIOClient from "socket.io-client";
import axios from "axios"

var jwt = require("jsonwebtoken")

const RoleList = (props) => {
  const [open, setOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const useStyles = makeStyles((theme) => ({
    role: {
      height: 50,
      display: "flex",
      alignItems: "center",
      paddingLeft: 20,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    },
    actionRole: {
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    },
    actionRoleSelected: {
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: 'pointer',
      backgroundColor: theme.palette.secondary.light,
    },
    roleSelected: {
      height: 50,
      display: "flex",
      alignItems: "center",
      paddingLeft: 20,
      cursor: 'pointer',
      backgroundColor: theme.palette.secondary.light,
    },
    addMember: {
      width: 300,
      height: 150,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-75px",
      marginLeft: "-100px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      '&:focus': {
        outlineStyle: "none"
      }
    },
    usernameField: {
      width: 150,
      height: 50,
      backgroundColor: theme.palette.secondary.light,
      marginRight: 20,
      display: "flex",
      justifyContent: "center",
      paddingLeft: 10,
    },
    tagField: {
      width: 75,
      height: 50,
      backgroundColor: theme.palette.secondary.light,
      display: "flex",
      justifyContent: "center",
      paddingLeft: 10,
    },
    errorMessage: {
      color: theme.palette.primary.main,
      fontSize: 15
    }
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChange(event.target.id)
  }

  const onAddRole = (role_name) => {
    setOpen(false);
    props.onAddRole(role_name)
  }

  const renderRoles = () => {
    return props.roles.map((role, i) => {
      if (i !== props.roles.length - 1) {
        return (
          <div 
            key={i}
          >
            <Paper
              elevation={0}
              square
              onClick={handleChange}
              id={i}
              className={props.selected === i ? classes.roleSelected : classes.role}
            >
              {role.api_role}
            </Paper>
            <Divider light variant="middle"/>
          </div>
        )
      }
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTag = (event) => {
    if (event.target.value.length < 5) {
      if (event.target.value.length === 0) {
        setTag(event.target.value)
      } else if (isNaN(event.target.value) === false) {
        setTag(event.target.value)
      }
    }
  }

  const handleSubmit = (event) => {
    setLoading(true)
    event.preventDefault()

    if (username.length < 1) {
      setError("Please enter a username")
      return
    } else if (tag.length !== 4) {
      setError("Please enter the user's 4 digit tag")
      return
    } else {
      setError("")
      axios.get("/api/users/credential/" + username + "#" + tag).then((api_users) => {
      
        if (api_users.data.length > 0) {
          api_users.data.forEach((user) => {
            if (user.username === username + "#" + tag) {
              let formData = new FormData()
              formData.append("project_id", props.project_id)
              formData.append("user_id", user.user_id)
  
              axios.post("/api/roles/invite", formData).then(() => {
                setLoading(false)
                const socket = socketIOClient("http://localhost:3001");
                socket.emit("INVITE_SENT", user.user_id)
                socket.on("PROJECT_INVITE", (data) => {
                  if (window.localStorage.getItem("authToken")) {
                    const encrypted = window.localStorage.getItem("authToken")
                    const token = jwt.decode(JSON.parse(encrypted))
            
                    console.log("Someone invited")
            
                    if (parseInt(token.user_id) === parseInt(data)) {
                      props.setNotificationOpen(true)
                    }
                  }
                });
  
                setUsername("")
                setTag("")
                setAddMemberOpen(false)
                props.onAddRole()
              })
              .catch((error) => {
                setLoading(false)
                if (error.response.data.detail !== undefined) {
                  setError(error.response.data.detail)
                } else {
                  console.log(error)
                }
              })
            }
          })
        } else {
          setError("User doesn't exist")
        }
  
      })
      .catch((error) => {
        console.log(error)
      })
    }

  }

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item style={{ width: "100%", height: "100%" }}>
        <Card
          style={{ height: props.mode === "admin" ? "calc(100% - 150px)" : "100%" }}
          square
          elevation={0}
          value={props.selected}
        >
          {renderRoles()}
        </Card>
        {props.mode === "admin" ? <Card
          className={classes.actionRole}
          elevation={0}
          square
          onClick={() => setAddMemberOpen(true)}
        >
          Add member
          <Add style={{ marginLeft: 10 }} color="primary"/>
        </Card> : null}
        {props.mode === "admin" ? <Card
          className={props.selected === props.roles.length - 1 ? classes.actionRoleSelected : classes.actionRole}
          elevation={0}
          square
          onClick={props.onChangeMode}
        >
          Change roles
          <Edit style={{ marginLeft: 10 }} color="primary"/>
        </Card> : null}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10
        }}>
          {props.mode === "admin" ? <Button type="normal" variant="contained" color="primary" buttonText="New role" onClick={handleOpen}/> : null}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          disableScrollLock
        >
          <div>
            <CreateRole project_id={props.project_id} onAddRole={onAddRole}/>
          </div>
        </Modal>
        <Modal
          disableScrollLock
          open={addMemberOpen}
          onClose={() => setAddMemberOpen(false)}
        >
          <Card
            className={classes.addMember}
            component="form"
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paper
                className={classes.usernameField}
                square
              >
                <InputBase
                  placeholder="Username"
                  className={classes.input}
                  value={username}
                  onChange={(event) => event.target.value.length < 25 ? setUsername(event.target.value) : null}
                />
              </Paper>
              <Paper
                className={classes.tagField}
                square
              >
                <InputBase
                  placeholder="0000"
                  className={classes.input}
                  startAdornment="#"
                  value={tag}
                  onChange={handleChangeTag}
                />
              </Paper>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: loading ? 40 : 0
              }}
            >
              <MuiButton
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 10 }}
              >
                Add user
              </MuiButton>
              {loading ? 
                <CircularProgress 
                  color="primary"
                  size={20}
                  style={{
                    marginLeft: 10
                  }}
                /> : null}
            </div>
            <div
              className={classes.errorMessage}
            >
              {error}
            </div>
          </Card>
        </Modal>
      </Grid>
    </Grid>

  )

}

export default RoleList