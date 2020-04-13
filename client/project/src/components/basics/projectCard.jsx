import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography"
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { useBouncyShadowStyles } from '@mui-treasury/styles/shadow/bouncy';
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

    axios.get("http://localhost:3001/thumbnails/2").then((data) => {
      const base64Flag = 'data:image/png;base64,'
      const imageStr = arrayBufferToBase64(data.data.data.data)
      setThumbnail(((base64Flag + imageStr).toString()))
    })
  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : null,
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 300,
      width: 300,
      borderRadius: theme.spacing(4),
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        paddingTop: theme.spacing(2),
      },
    },
    mediaContainer: {
      width: '88%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(-3),
      borderRadius: theme.spacing(4),
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },  
    media: {
      width: "100%",
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 0,
      height: 0,
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
      color: theme.palette.secondary.dark
    }
  }));
  const classes = useStyles();
  const shadowStyles = useOverShadowStyles();
  const darkModeShadowStyles = useBouncyShadowStyles();
  const styles = useStyles();

  return (
    <div>
      <Card className={cx(classes.root, props.selectedTheme.name === "darkModeTheme" ? darkModeShadowStyles.root : shadowStyles.root)}
        onClick={() => {console.log("test")}}
      >
          <Card className={classes.mediaContainer}>
            <CardMedia
                image={thumbnail}
                className={styles.media}
                src={thumbnail}
              />
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
      </Card>
    </div>
  )

}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps)(ProjectCard)