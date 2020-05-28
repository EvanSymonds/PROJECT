import React, { useState, useEffect, useCallback } from "react";
import useDimensions from 'react-use-dimensions';
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/paper"
import Typography from "@material-ui/core/Typography"
import LayersIcon from '@material-ui/icons/LayersOutlined';
import ImageIcon from '@material-ui/icons/ImageOutlined';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import TheatersIcon from '@material-ui/icons/TheatersOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "../basics/button"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import axios from "axios"

const File = (props) => {
  const [anchorEl, setAnchorEl] = useState (null)
  const [selected, setSelected] = useState(false)
  const [ref, position] = useDimensions();
  const [translate, setTranslate] = useState({
    isDragging: false,
    translateX: null,
    translateY: null
  })

  useEffect(() => {
    setTranslate({
      ...translate,
      translateX: position.x,
      translateY: position.y
    })
  }, [position])

  const handleMouseMove = ev => {
    if (translate.isDragging) {
      setTranslate(prevTranslate => ({
        ...prevTranslate,
        translateX: ev.clientX,
        translateY: ev.clientY
      }));
    }
  }

  const handleMouseUp = ev => {
    if (translate.isDragging) {
      setTranslate(prevTranslate => ({
        ...prevTranslate,
        isDragging: false
      }));
      props.onDragStop()
    }
  }

  const handleDragStart = (event) => {
    event.preventDefault()
    setTranslate({...translate, isDragging: true})
    props.onDragStart({id: props.file_id, type: "file"})
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const onSelect = () => {
    setSelected(true)
  }

  const onDeselect = () => {
    setSelected(false)
  } 

  const useStyles = makeStyles((theme) => ({
    root: {
      cursor: 'pointer',
      backgroundColor: selected ? theme.palette.secondary.light : theme.palette.background.default,
      paddingLeft: 10,
    },
    text: {
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
    draggable: {
      backgroundColor: theme.palette.secondary.light
    }
  }))
  const classes = useStyles()

  const fileTypes = [["jpg", "png", "jpeg"],["txt", "docx"],["stl", "3ds", "f3d"],["mp4", "mov", "avi"],["mp3", "wav", "midi"]]

  const renderIcon = () => {
    let fileType

    for (let i=0; i<fileTypes.length; i++) {
      if (fileTypes[i].indexOf(props.fileType) > -1){
        fileType = i
      }
    }

    switch (fileType){
      default:
        return <DescriptionIcon fontSize="large" color="secondary" />
      case 0:
        return <ImageIcon fontSize="large" color="secondary" />
      case 1:
        return <DescriptionIcon fontSize="large" color="secondary" />
      case 2:
        return <LayersIcon fontSize="large" color="secondary"/>
      case 3:
        return <TheatersIcon fontSize="large" color="secondary"/>
    }
  }

  const onMore = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const onDelete = () => {
    let formData = new FormData()

    formData.append("folder_id", parseInt(props.folder_id))
    formData.append("type", 'file')

    const url = "http://localhost:3001/file_system/delete/" + props.file_id
    axios.post(url, formData).then((response, error) => {
      if (error) {
        console.log(error)
      } else {
        setAnchorEl(null)
        props.updateParent(`props.fileIndex`)
      }
    })
  }

  const onDownload = () => {
    const url = "http://localhost:3001/files/" + props.file_id

    axios.get(url).then((response, error) => {
      if (error) {
        console.log(error)
      } else {
        window.location.assign(url)
      }
    })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div
      ref={ref}
      onDragStart={handleDragStart}
      style={{
        position: translate.isDragging && translate.translateX !== null ? "absolute" : null,
        left: translate.translateX,
        top: translate.translateY
      }}
      draggable
    >
      {
        
        translate.isDragging === false ? 
        <ClickAwayListener onClickAway={onDeselect}>
          <Grid 
            container 
            direction="row" 
            justify="center" 
            alignItems="center"
            className={classes.root}
            onClick={onSelect}
          >
            <Grid item xs={1} style={{ marginTop: 2 }}>
              {renderIcon()}
            </Grid>
            <Grid item xs={8} style={{ marginTop: 2 }}>
              <Typography className={classes.text}>
                {props.fileName}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.text}>
                {props.fileType}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button type="icon" icon="More" color="secondary" onClick={onMore} aria-controls="simple-menu" aria-haspopup="true"/>
              <Menu
                anchorEl = {anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem onClick={onDelete}>
                  <DeleteIcon fontSize="small" color="secondary"/>
                  Delete
                </MenuItem>
                <MenuItem onClick={onDownload}>
                  <GetAppIcon fontSize="small" color="secondary"/>
                  Download
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </ClickAwayListener>

        :

        <Paper
          style={{ padding: 5 }}
          className={classes.draggable}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid
              item
              style={{ marginRight: 5 }}
            >
              {renderIcon()}
            </Grid>
            <Grid
              item
            >
              <div>
                {props.fileName}
              </div>
            </Grid>
          </Grid>
        </Paper>

      }
    </div>
  )

}

export default File