import React, { useState, useEffect } from "react"
import FileSystem from "../complex/fileSystem"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';

const ProjectHome = (props) => {
  const [project_id] = useState(parseInt(props.match.params.project_id))
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [width, setWidth] = React.useState(window.innerWidth);

  const useStyles = makeStyles((theme) => ({
    page: {
      height: window.innerHeight - 96,
      marginLeft: permanentSidebar ? 250 : 0,
      marginTop: permanentSidebar ? 48 : 0
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: width,
      height: "100%"
    }
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

  return (
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.page}>
        <FileSystem project_id={project_id} />
      </div>
    </Paper> 
  )

}

export default ProjectHome