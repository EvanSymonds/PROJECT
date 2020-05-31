import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Button from "./button"
import CardMedia from '@material-ui/core/CardMedia';
import Paper from "@material-ui/core/paper"
import Typography from "@material-ui/core/Typography"
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { useBouncyShadowStyles } from '@mui-treasury/styles/shadow/bouncy';
import Avatar from '@material-ui/core/Avatar';
import ProfilePicture from "./profilePicture"
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Lock, Public, AddRounded, ImageOutlined } from "@material-ui/icons"
import Grid from "@material-ui/core/Grid"
import axios from "axios"

const ProjectCard = (props) => {
  const [thumbnail, setThumbnail] = useState("")

  useEffect(() => {
    const arrayBufferToBase64 = (buffer) => {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
    };

    if (props.project_id !== -1) {
      axios.get("/api/thumbnails/" + props.project_id).then((data) => {
        const base64Flag = 'data:image/png;base64,'
        const imageStr = arrayBufferToBase64(data.data.data.data)
        setThumbnail(((base64Flag + imageStr).toString()))
      })
      .catch((error) => {
        if (error.response.data === "No thumbnail"){
          setThumbnail(null)
        }
      })
    }
  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      marginLeft: 50,
      marginRight: "auto",
      marginBottom: 50,
      height: 350,
      width: 350,
      borderRadius: theme.spacing(4),
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    },
    mediaContainer: {
      width: '88%',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 200,
      marginTop: theme.spacing(-3),
      borderRadius: theme.spacing(4),
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },  
    media: {
      width: "100%",
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 200,
      borderRadius: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
      '&:after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(2),
        opacity: 0.5,
      },
    },
    textBody: {
      color: theme.palette.primary.main,
      fontSize: 16
    },
    avatarGroup: {
      '& .MuiAvatar-root': {
        width: 35,
        height: 35,
      }
    },
    placeholder: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: theme.palette.secondary.main,
      width: "100%",
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: "auto",
      marginBotton: "auto",
      height: 200,
      paddingBottom: '60%',
      borderRadius: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
      '&:after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(2),
        opacity: 0.5,
      },
    },
    addIcon: {
      fontSize: 120,
      color: theme.palette.secondary.dark
    },
    createText: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
      fontSize: 25,
      fontWeight: "bold",
      color: theme.palette.secondary.dark
    }
  }));
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const darkModeShadowStyles = useBouncyShadowStyles();
  const styles = useStyles();

  const renderIcon = () => {
    if (props.isPublic === true) {
      return <Public color="primary" fontSize="large"/>
    } else {
      return <Lock color="primary" fontSize="large"/>
    }
  }

  const renderAvatars = () => {
    const avatars = props.memberList.map((member, i) => {
      if (member.user_id !== "-1") {
        return (<Avatar key={i}>
          <ProfilePicture user_id={member.user_id} width={35} height={35} />
        </Avatar>
        )
      }
    })

    return avatars
  }

  const renderMedia = () => {
    if (thumbnail === null) {
      return (
        <Paper
          className={classes.placeholder}
        >
          <ImageOutlined style={{ fontSize: 70 }}/>
        </Paper>
      )
    } else if (props.project_id === -1) {
      return (
        <Paper
          className={classes.placeholder}
        >
          <AddRounded 
            className={classes.addIcon}
          />
        </Paper>
      )
    } else {
      return (
        <CardMedia
          component="img"
          image={thumbnail}
          className={classes.thumbnail}/>
      )
    }
  }

  const handleAcceptInvite = () => {
    let formData = new FormData()
    formData.append("project_id", props.project_id)
    formData.append("role_id", props.role_id)

    axios.post("/api/roles/invite/accept", formData).then((results) => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleDeclineInvite = () => {
    let formData = new FormData()
    formData.append("project_id", props.project_id)
    formData.append("role_id", props.role_id)

    axios.post("/api/roles/invite/decline", formData).then((results) => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <div>
      <Card className={cx(classes.root, props.selectedTheme.name === "darkModeTheme" ? darkModeShadowStyles.root : shadowStyles.root)}
        onClick={props.type === "normal" ? props.onClick : null}
      >
          <Card className={classes.mediaContainer}>
            {renderMedia()}
          </Card>
          {props.project_id !== -1 ?<div style={{
            textAlign: "left",
            marginTop: 20,
            width: "85%",
          }}>
            <Typography noWrap variant="h5">
              <Box fontFamily="Arial" fontWeight="fontWeightBold">
                {props.project_name}
              </Box>
            </Typography>
            <div style={{
              marginTop: 5
            }}>
              <Typography
                className={classes.textBody}
                noWrap variant="body2">
                  {props.type === "invite" ? "Invite" : `${props.members} ${props.members > 1 ? "members" : "member"}`}
              </Typography>
            </div>
          </div> : 
          <div
            className={classes.createText}
          >
            Create project
          </div>}
          {props.project_id !== -1 ? <Grid container style={{
            marginTop: 15,
            marginLeft: 60
          }}>
            <Grid item xs={9}>
              {props.type === "invite" ? 
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <div style={{ marginRight: 10 }}>
                  <Button
                    type="icon"
                    icon="Done"
                    color="primary"
                    onClick={handleAcceptInvite}
                  />
                </div>
                <Button
                  type="icon"
                  icon="Close"
                  color="primary"
                  onClick={handleDeclineInvite}
                />
              </div>
              :
              <AvatarGroup max={4} width="35" className={classes.avatarGroup}>
                {renderAvatars()}
              </AvatarGroup>
              }
            </Grid>
            <Grid item xs={2}>
              {renderIcon()}
            </Grid>
          </Grid> : null}
      </Card>
    </div>
  )

}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps)(ProjectCard)