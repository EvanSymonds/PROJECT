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

  useEffect(() => {renderProjectCards()}, [])

  const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: 16,
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
      marginTop: 48,
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "calc(100% + 10px)"
    }
  }));
  const classes = useStyles();
  const history = useHistory();

  const handleNewProject = () => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    axios.post("http://localhost:3001/projects/create/" + token.user_id).then(() => {
      setProjects([])
      renderProjectCards()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }

  const renderProjectCards = () => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))
    
    axios.get("http://localhost:3001/roles/user/" + token.user_id).then((roles) => {  

      let projectArray = []

      roles.data.forEach((role) => {
        if (role.user_id !== "-1") {
          axios.get("http://localhost:3001/projects/" + role.project_id).then((project) => {

          axios.get("http://localhost:3001/roles/project/" + project.data[0].project_id).then((users) => {
            const realUsers = users.data.filter((user) => user.user_id !== "-1")
            
            projectArray = [...projectArray, {
              project_id: project.data[0].project_id,
              project_name: project.data[0].project_name,
              isPublic: project.data[0].is_public,
              members: realUsers.length,
              memberList: realUsers
            }]

            setProjects(projectArray)
          })

        })
        }
      })

    })
  }

  return (
    <Paper
      square
      elevation={0}
      className={classes.background}
    >
      <Sidebar onResize={onResize}/>
      <div className={classes.page}>
        <Grid 
          container
          spacing={6}
          style={{
            marginLeft: 50,
            marginTop: 20,
            width: "calc(100% - 50px)",
          }}
        >
          <Grid
            item
          >
            <ProjectCard 
              project_id={-1}
              onClick={handleNewProject}
            />
          </Grid>
          {projects.map((project, i) => 
            <Grid item key={i} >
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