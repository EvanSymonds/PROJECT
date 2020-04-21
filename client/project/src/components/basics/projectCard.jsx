import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from "@material-ui/core/paper"
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import Typography from "@material-ui/core/Typography"
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { useBouncyShadowStyles } from '@mui-treasury/styles/shadow/bouncy';
import Avatar from '@material-ui/core/Avatar';
import ProfilePicture from "./profilePicture"
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Lock, Public} from "@material-ui/icons"
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

    axios.get("http://localhost:3001/thumbnails/" + props.project_id).then((data) => {
      const base64Flag = 'data:image/png;base64,'
      const imageStr = arrayBufferToBase64(data.data.data.data)
      setThumbnail(((base64Flag + imageStr).toString()))
    })
    .catch((error) => {
      if (error.response.data === "No thumbnail"){
        setThumbnail(null)
      }
    })
  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 350,
      width: 350,
      borderRadius: theme.spacing(4),
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    mediaContainer: {
      width: '88%',
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
          <ImageOutlinedIcon style={{ fontSize: 70 }}/>
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

  return (
    <div>
      <Card className={cx(classes.root, props.selectedTheme.name === "darkModeTheme" ? darkModeShadowStyles.root : shadowStyles.root)}
        onClick={props.onClick}
      >
          <Card className={classes.mediaContainer}>
            {renderMedia()}
          </Card>
          <div style={{
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
                  {`${props.members} members`}
              </Typography>
            </div>
          </div>
          <Grid container style={{
            marginTop: 15,
            marginLeft: 60
          }}>
            <Grid item xs={9}>
              <AvatarGroup max={4} width="35" className={classes.avatarGroup}>
                {renderAvatars()}
              </AvatarGroup>
            </Grid>
            <Grid item xs={2}>
              {renderIcon()}
            </Grid>
          </Grid>
      </Card>
    </div>
  )

}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps)(ProjectCard)