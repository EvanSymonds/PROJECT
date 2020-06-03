import React, { useState, useEffect } from "react";
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import ProjectCard from "../basics/projectCard"
import Grid from "@material-ui/core/grid"
import Snackbar from '@material-ui/core/Snackbar';
import Button from "../basics/button"
import Skeleton from "@material-ui/lab/Skeleton"
import socketIOClient from "socket.io-client";
import axios from "axios"

var jwt = require("jsonwebtoken")

const Projects = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)
  const [projects, setProjects] = useState([])
  const [invites, setInvites] = useState([])
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {renderProjectCards()}, [])
  useEffect(() => {
    const socket = socketIOClient("http://localhost:3001");
    socket.on("PROJECT_INVITE", (data) => {
      if (window.localStorage.getItem("authToken")) {
        const encrypted = window.localStorage.getItem("authToken")
        const token = jwt.decode(JSON.parse(encrypted))

        if (parseInt(token.user_id) === data) {
          setNotificationOpen(true)
          renderProjectCards()
        }
      }
    });
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
      marginTop: 48,
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "100%",
      overflow: "auto",
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
  const history = useHistory();

  const handleNewProject = () => {
    setLoading(true)
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    axios.post("/api/projects/create/" + token.user_id).then(() => {
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
    setInvites([])
    setProjects([])

    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))
    
    axios.get("/api/roles/user/" + token.user_id).then((roles) => {  
      let invitedArray = []

      console.log(roles)

      if (roles.data.length === 0) {
        setLoading(false)
      } else {
        roles.data.forEach((role) => {
          if (role.role_name === "INVITED") {
            axios.get("/api/projects/" + role.project_id).then((project) => {
              setInvites([...invitedArray, {
                project_id: project.data[0].project_id,
                project_name: project.data[0].project_name,
                isPublic: project.data[0].is_public,
                role_id: role.role_id
              }])
              setLoading(false)
            })
            .catch((error) => {
              console.log(error)
            })
          }
        })
  
        roles = roles.data.filter((role) => role.role_name !== "INVITED")
  
        let projectArray = []
  
        roles.forEach((role) => {
          if (role.user_id !== "-1") {
            axios.get("/api/projects/" + role.project_id).then((project) => {
  
            axios.get("/api/roles/project/" + project.data[0].project_id).then((users) => {
              setLoading(false)
  
              const realUsers = users.data.filter((user) => user.user_id !== "-1" && user.role_name !== "INVITED")
              
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
      }

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
          style={{
            marginLeft: 30,
            marginTop: 20,
            width: "calc(100% - 50px)",
          }}
        >
          <Grid
            item
          >
            <ProjectCard 
              project_id={-1}
              type="normal"
              onClick={handleNewProject}
            />
          </Grid>
          {loading ? 
            [0,0,0].map((num, i) => 
            <div
              key={"Skeleton" + i}
              style={{
                marginLeft: 50
              }}
            >
              <Skeleton
                variant="rect"
                width={308}
                height={200}
                animation="wave"
                style={{ marginBottom: 5 }}
              />
              <Skeleton
                variant="text"
                width={180}
              />
              <Skeleton
                variant="text"
                width={180}
              />
              <Skeleton
                variant="circle"
                width={40}
                height={40}
              />
            </div>)
            :
            <React.Fragment>
              {invites.map((project, i) => 
                <ProjectCard
                  type="invite"
                  key={i} 
                  role_id={project.role_id}
                  project_id={project.project_id} 
                  project_name={project.project_name} 
                  members={project.members}
                  memberList={project.memberList}
                  rerender={renderProjectCards}
                  isPublic={project.isPublic}
                  onClick={() => history.push(project.project_name + "/" + project.project_id)}
                />
              )}
              {projects.map((project, i) => 
                <Grid item key={i} >
                  <ProjectCard
                    type="normal"
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
            </React.Fragment>
          }
        </Grid>
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

export default Projects