import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/card"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import Modal from "@material-ui/core/Modal"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/paper"
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import FileUpload from "../complex/fileUpload"
import Button from "../basics/button"
import axios from "axios"

const SelectThumbnail = (props) => {
  const [thumbnail, setThumbnail] = useState("")
  const [open, setOpen] = useState(false);

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
      const image = (base64Flag + imageStr).toString()

      setThumbnail(image)
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
      height: 150,
      width: 350,
      overflow: 'visible',
      display: 'flex',
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    thumbnail: {
      width: 200,
      height: 150,
      marginTop: theme.spacing(-4),
      borderRadius: theme.spacing(1),
      marginLeft: theme.spacing(4),
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
    },
    uploadButton: {
      height: 20,
      marginTop: 17,
    },
    content: {
      width: 110,
    },
    placeholder: {
      width: 200,
      height: 150,
      marginTop: theme.spacing(-4),
      borderRadius: theme.spacing(1),
      marginLeft: theme.spacing(4),
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 6px 15px rgba(34, 35, 58, 0.2)',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: theme.palette.secondary.main
    }
  }));
  const classes = useStyles();

  const onAddFile = () => {
    window.location.reload(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

      <Card
        className={classes.root}
      >
        {renderMedia()}
        <CardContent className={classes.content}>
          <Grid
            container
            direction="column"
            alignItems="flex-end"
          >
            <Grid item>
              <Typography variant="h6" className={classes.text}>
                Project
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.text}>
                Thumbnail
              </Typography>
            </Grid>
            <Grid item>
              <div className={classes.uploadButton}>
                <Button type="normal" variant="contained" buttonText="Upload" color="primary" onClick={handleOpen}/>
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Modal
          data-test="component-fileUpload"
          open={open}
          onClose={handleClose}
        >
          <div>
            <FileUpload 
              updateParent={onAddFile}
              credentialType="project_id"
              credential={props.project_id} 
              maxFiles={1}
              endpoint="/thumbnails/update"  
            />
          </div>
        </Modal>
      </Card>

  )

}

export default SelectThumbnail