import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"
import Card from "@material-ui/core/card"
import TextField from "@material-ui/core/textField"
import ProfilePicture from "./profilePicture"
import axios from "axios"
import Button from "./button"
import MaterialButton from "@material-ui/core/button"

const UserDetails = (props) => {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState("view")
  const [usernameError, setUsernameError] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 450,
      height: 170,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 15,
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : theme.palette.background.default,
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginLeft: 20
    },
    header: {
      textTransform: "uppercase",
      fontSize: 15,
      fontWeight: "bold",
      color: theme.palette.secondary.dark
    },
    usernameText: {
      marginBottom: 10,
      fontSize: 15,
      maxWidth: 270,
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    emailText: {
      marginBottom: 10,
      fontSize: 15,
      width: 270,
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    userNumbers: {
      fontSize: 15,
      color: theme.palette.primary.main,
      marginLeft: 5,
    },
    editButton: {
      marginLeft: mode === "edit" ? 50 : 20
    },
    input: {
      marginBottom: 5
    }
  }));
  const classes = useStyles()

  const getUser = () => {
    return new Promise((resolve, reject) => {
      axios.get("/api/users/" + props.user.user_id).then((user) => {
        setUser(user.data[0])
        resolve()
      })
      .catch((error) => {
        console.log(error)
        reject()
      })
    })
  }

  useEffect(() => {
    axios.get("/api/users/" + props.user.user_id).then((user) => {
      setUser(user.data[0])
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  const handleUsernameChange = (event) => {
    setUser({...user, username: event.target.value})
  }

  const handleEmailChange = (event) => {
    setUser({...user, email: event.target.value})
  }

  const handleSubmit = async(event) => {
    event.preventDefault()

    let formData = new FormData()
    formData.append("username", user.username)
    formData.append("email", user.email)

    axios.post("/api/users/" + props.user.user_id, formData).then(async() => {
      await getUser().then(() => {
        setMode("view")
      })
    })
    .catch((error) => {
      console.log(error.response)
      if (error.response.data.details[0].path === "username") {
        setUsernameError(error.response.data.details[0].message)
      } else {
        setEmailError(error.response.data.details[0].message)
      }
    })
  }

  const renderUserDetails = () => {
    if (mode === "view") {
      return (
        <div 
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div
            className={classes.container}
          >
            <div
              className={classes.header}
            >
              Username
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                className={classes.usernameText}
              >
                {user.username.slice(0, user.username.length - 5)}
              </div>
              <div
                className={classes.userNumbers}
              >
                {user.username.slice(user.username.length - 5, user.username.length)}
              </div>
            </div>
            <div
              className={classes.header}
            >
              Email
            </div>
            <div
              className={classes.emailText}
            >
              {user.email}
            </div>
          </div>
          <div
            className={classes.editButton}
          >
            <Button
              type="icon"
              icon="Edit"
              color="primary"
              onClick={() => {
                setMode("edit")
                setUser({...user, username: user.username.slice(0, user.username.length - 5)})
              }}
            />
          </div>
        </div>
      )
    } else {
      return (
        <form 
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div
            className={classes.container}
          >
            <TextField 
              className={classes.input}
              onChange={handleUsernameChange}
              label="Username"
              variant="filled"
              color="primary"
              value={user.username}
              helperText={usernameError === false ? null : usernameError}
            />
            <TextField 
              onChange={handleEmailChange}
              label="Email"
              variant="filled"
              color="primary"
              value={user.email}
              helperText={emailError === false ? null : emailError}
            />
          </div>
          <div
            className={classes.editButton}
          >
            <MaterialButton
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </MaterialButton>
          </div>
        </form>
      )
    }
  }

  return (

    <div>
      {user !== null ? <Card
        className={classes.root}
      >
        <div style={{ marginRight: 5 }}>
          <ProfilePicture
            user_id={parseInt(user.user_id)}
            shape="circle"
            width={75}
            height={75}
            mode={mode}
            credential={props.user.user_id}
          />
        </div>
        {renderUserDetails()}
      </Card> : null}
    </div>

  )

}

export default UserDetails