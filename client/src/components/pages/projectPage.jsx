import React, { useState, useEffect } from "react"
import Team from "../complex/team"
import Roadmap from "../complex/roadmap"
import FileSystem from "../complex/fileSystem"
import ProjectSettings from "../complex/projectSettings"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/Paper"
import ProjectMenu from "../basics/projectMenu"
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from "../basics/button"
import axios from "axios"

import { connect } from "react-redux"
import { changeSettingsAuth, editFilesAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const ProjectPage = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [page, setPage] = useState(0)
  const [project_id] = useState(parseInt(props.match.params.project_id))
  const [notificationOpen, setNotificationOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("/api/roles/invites").then((invites) => {
        invites.data.forEach((invite) => {
          if (window.localStorage.getItem("authToken")) {
            const encrypted = window.localStorage.getItem("authToken")
            const token = jwt.decode(JSON.parse(encrypted))
    
            if (parseInt(token.user_id) === parseInt(invite.user_id)) {
              setNotificationOpen(true)
              axios.post("/api/roles/invite/viewed/" + invite.role_id)
            }
          }
        })
      })
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const token = window.localStorage.getItem("authToken")
    const formData = new FormData()
    formData.append("token", token)
    formData.append("project_id", project_id)

    axios.post("/api/auth/authlevel", formData).then((response) => {
      const authToken = JSON.stringify(response.headers["x-auth-token"])

      window.localStorage.setItem("authToken", authToken)

      axios.get("/api/project_settings/" + project_id).then((response) => {
        props.changeSettingsAuth(response.data.rows[0].change_settings_auth)
        props.editFilesAuth(response.data.rows[0].edit_files_auth)
      })
      .catch((error) => {
        console.log(error)
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: 16,
        backgroundColor: theme.palette.background.default,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.secondary.main,
        width: 6,
        border: "4px solid rgba(0, 0, 0, 0)",
        backgroundClip: "padding-box",
        borderRadius: 10
      }
    },
    page: {
      marginLeft: permanentSidebar ? 250 : 0,
      height: "calc(100% - 52px)"
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: page === 0 ? "calc(100% + 10px)" : "100%"
    },
    title: {
      marginLeft: permanentSidebar ? 250 : 0,
      width: window.innerWidth - 96,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    notification: {
      backgroundColor: theme.palette.secondary.light,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: '0px 5px 0px 10px',
    }
  }));
  const classes = useStyles();

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }

  const changePage = (page) => {
    setPage(page)
  }

  const renderPages = () => {
    switch (page) {
      case 0: 
        return <FileSystem project_id={project_id}/>
      case 1: 
        return <Team project_id={project_id} setNotificationOpen={setNotificationOpen}/>
      case 2: 
        return <ProjectSettings project_id={project_id}/>
    }
  }

  return (
    <Paper square className={classes.background}>
      <div style={{
        display: "flex",
        flexDirection: "row",
      }}>
        <Sidebar onResize={onResize}/>
        <div className={classes.title}>
          <ProjectMenu changePage={changePage}/>
        </div>
      </div>
      <div className={classes.page}>
        {renderPages()}
      </div>
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
      >
        <Paper
          className={classes.notification}
        >
          <div
            style={{
              fontSize: 15,
              marginRight: 15
            }}
          >
            New project invite!
          </div>
          <Button
            type="icon"
            icon="Close"
            onClick={() => setNotificationOpen(false)}
          />
        </Paper>
      </Snackbar>
    </Paper> 
  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth , editFilesAuth })(ProjectPage)