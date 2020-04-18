import React, { useState, useEffect } from "react"
import Team from "../complex/team"
import FileSystem from "../complex/fileSystem"
import ProjectHome from "../complex/projectHome"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import ProjectMenu from "../basics/projectMenu"
import { makeStyles } from '@material-ui/core/styles';

const ProjectPage = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [width, setWidth] = React.useState(window.innerWidth);
  const [page, setPage] = useState(0)
  const [project_id] = useState(parseInt(props.match.params.project_id))

  const useStyles = makeStyles((theme) => ({
    page: {
      height: window.innerHeight - 96,
      marginLeft: permanentSidebar ? 250 : 0,
      marginTop: 48
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: width,
      height: "100%"
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
        return <ProjectHome project_id={project_id}/>
      case 1: 
        return <FileSystem project_id={project_id}/>
      case 2: 
        return <Team project_id={project_id}/>
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

export default ProjectPage