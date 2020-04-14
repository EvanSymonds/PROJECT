import React, { useState, useEffect } from "react";
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import ProjectCard from "../basics/projectCard"
import Grid from "@material-ui/core/grid"
import axios from "axios"

var jwt = require("jsonwebtoken")

const Projects = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [projects, setProjects] = useState([])
  const [width, setWidth] = React.useState(window.innerWidth);

  useEffect(() => {renderProjectCards()}, [])

  const useStyles = makeStyles((theme) => ({
    page: {
      height: window.innerHeight - 96,
      marginLeft: permanentSidebar ? 250 : 0,
      marginTop: permanentSidebar ? 48 : 0,
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
  const history = useHistory();


  const onResize = () => {
    if (window.innerWidth <= 1000){
      setWidth(window.innerWidth)
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setWidth(window.innerWidth)
      setPermanentSidebar(true)
    }
  }

  const renderProjectCards = () => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))
    
    axios.get("http://localhost:3001/roles/user/" + token.user_id).then((roles) => {  

      roles.data.forEach((role) => {
        axios.get("http://localhost:3001/projects/" + role.project_id).then((project) => {
          
          axios.get("http://localhost:3001/roles/project/" + project.data[0].project_id).then((users) => {  
            setProjects([...projects, {
              project_id: project.data[0].project_id,
              project_name: project.data[0].project_name,
              isPublic: project.data[0].is_public,
              members: users.data.length,
              memberList: users.data
            }])
          })

        })
      })

    })
  }

  return (
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.page}>
        <Grid container style={{
          marginLeft: 50,
          marginTop: 20,
          width: width,
          maxWidth: 500,
        }}>
          {projects.map((project, i) => 
            <Grid item xs={3} key={i} >
              <ProjectCard 
                key={i} 
                project_id={project.project_id} 
                project_name={project.project_name} 
                members={project.members}
                memberList={project.memberList}
                isPublic={project.isPublic}
                onClick={() => history.push(project.project_name + "/" + project.project_id)}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </Paper> 
  )
}

export default Projects