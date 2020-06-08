import React, { useState, useEffect, useCallback } from "react";
import useDimensions from 'react-use-dimensions';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
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
import Skeleton from '@material-ui/lab/Skeleton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import axios from "axios"

const initialState = {
  mouseX: null,
  mouseY: null,
};

const File = (props) => {
  const [state, setState] = useState(initialState);
  const [anchorEl, setAnchorEl] = useState (null)
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
    props.selectFile(props.file_id)
  }

  const onDeselect = (event) => {
    if (event !== undefined && event.target.parentNode !== null) {
      if (event.target.id !== "folder-element" && event.target.parentNode.id !== "folder-element" && event.target.id !== "file-element" && event.target.parentNode.id !== "file-element") {
        props.selectFile(null)
      }
    }
  } 

  const useStyles = makeStyles((theme) => ({
    root: {
      cursor: 'pointer',
      backgroundColor: parseInt(props.selected) === parseInt(props.file_id) ? theme.palette.secondary.light : theme.palette.background.default,
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
        return <DescriptionIcon fontSize="large" color="secondary" id="file-element"/>
      case 0:
        return <ImageIcon fontSize="large" color="secondary" id="file-element"/>
      case 1:
        return <DescriptionIcon fontSize="large" color="secondary"id="file-element" />
      case 2:
        return <LayersIcon fontSize="large" color="secondary" id="file-element"/>
      case 3:
        return <TheatersIcon fontSize="large" color="secondary" />
    }
  }

  const handleClick = (event) => {
    props.selectFile(null)

    event.preventDefault();
    onSelect()
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const onMore = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const onDelete = () => {
    let formData = new FormData()

    formData.append("folder_id", parseInt(props.folder_id))
    formData.append("type", 'file')

    const url = "/api/file_system/delete/" + props.file_id
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
    const url = "http://localhost:3001/api/files/" + parseInt(props.file_id)

    const link = document.createElement('a')
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    setState(initialState);
    onDeselect()
    setAnchorEl(null)
  }

  return (
    <div
      ref={ref}
      id="file-element"
      onDragStart={props.type === "normal" ? handleDragStart : null}
      style={{
        position: translate.isDragging && translate.translateX !== null ? "absolute" : null,
        left: translate.translateX,
        top: translate.translateY
      }}
      draggable={props.type === "normal"}
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
            onContextMenu={handleClick}
            id="file-element"
          >
            <Grid
              item
              xs={1}
              style={{ marginTop: 2 }}
              id="file-element"
            >
              {props.type === "skeleton" ?
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  id="file-element"
                />
                :
                renderIcon()
              }
            </Grid>
            <Grid
              item
              xs={8}
              style={{ marginTop: 2 }}
              id="file-element"
            >
              {props.type === "skeleton" ?
                <div style={{  width: "70%", marginTop: 2 }} id="file-element">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
                :
                <Typography className={classes.text} id="file-element">
                  {props.fileName}
                </Typography>
              }
            </Grid>
            <Grid
              item
              xs={2}
              id="file-element"
            >
              {props.type === "skeleton" ?
                  <div style={{  width: "50%", marginTop: 2 }} id="file-element">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </div>
                  :
                  <Typography className={classes.text} id="file-element">
                    {props.fileType}
                  </Typography>
                }
            </Grid>
            <Grid
              item
              xs={1}
              id="file-element"
            >
              {props.type === "normal" ?
                <React.Fragment>
                  <Button id="file-element" type="icon" icon="More" color="secondary" onClick={onMore} aria-controls="simple-menu" aria-haspopup="true"/>
                  <Menu
                    anchorEl = {anchorEl}
                    disableScrollLock
                    id="file-element"
                    keepMounted
                    open={Boolean(anchorEl) || state.mouseY !== null}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: state.mouseY !== null ? "bottom" :'bottom',
                      horizontal: state.mouseY !== null ? "right" : 'center',
                    }}
                    transformOrigin={{
                      vertical: state.mouseY !== null ? "top" :'top',
                      horizontal: state.mouseY !== null ? "left" : 'center',
                    }}
                    anchorReference={state.mouseY !== null ? "anchorPosition" : "anchorEl"}
                    anchorPosition={
                      state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                    }
                  >
                    <MenuItem onClick={onDelete} id="file-element">
                      <DeleteIcon fontSize="small" color="secondary"/>
                      Delete
                    </MenuItem>
                    <MenuItem onClick={onDownload} id="file-element">
                      <GetAppIcon fontSize="small" color="secondary"/>
                      Download
                    </MenuItem>
                  </Menu>
                </React.Fragment>
                : null
              }
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