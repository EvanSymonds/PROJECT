import React, { useState, useEffect } from "react"
import Team from "../complex/team"
import Roadmap from "../complex/roadmap"
import FileSystem from "../complex/fileSystem"
import ProjectSettings from "../complex/projectSettings"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import ProjectMenu from "../basics/projectMenu"
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios"

import { connect } from "react-redux"
import { changeSettingsAuth, editFilesAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const ProjectPage = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [width, setWidth] = React.useState(window.innerWidth);
  const [page, setPage] = useState(0)
  const [project_id] = useState(parseInt(props.match.params.project_id))

  useEffect(() => {
    const token = window.localStorage.getItem("authToken")
    const formData = new FormData()
    formData.append("token", token)
    formData.append("project_id", project_id)

    axios.post("http://localhost:3001/auth/authlevel", formData).then((response) => {
      const authToken = JSON.stringify(response.headers["x-auth-token"])

      window.localStorage.setItem("authToken", authToken)

      axios.get("http://localhost:3001/project_settings/" + project_id).then((response) => {
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
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "calc(100% + 10px)"
    },
    title: {
      marginLeft: permanentSidebar ? 250 : 0,
      width: window.innerWidth - 96,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }));
  const classes = useStyles();

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setWidth(window.innerWidth)
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setWidth(window.innerWidth)
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
        return <Team project_id={project_id}/>
      case 2: 
        return <Roadmap project_id={project_id}/>
      case 3: 
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
    </Paper> 
  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth , editFilesAuth })(ProjectPage)