import React, { useState } from "react";
import Grid from "@material-ui/core/Grid"
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
import axios from "axios"

const File = (props) => {
  const [anchorEl, setAnchorEl] = useState (null)

  const fileTypes = [["jpg", "png", "jpeg"],["txt", "docx"],["stl", "3ds", "f3d"],["mp4", "mov", "avi"],["mp3", "wav", "midi"]]

  const renderIcon = () => {
    let fileType = 1

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

  const onDelete = () => {
    const url = "http://localhost:3001/files/" + props.file_id
    axios.delete(url).then((response, error) => {
      if (error) {
        console.log(error)
      } else {
        setAnchorEl(null)
        props.updateParent(props.fileIndex)
      }
    })
  }

  const onMore = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const onDownload = () => {
    const url = "http://localhost:3001/files/" + props.file_id
    axios.get(url).then((response, error) => {
      if (error) {
        console.log(error)
      } else {
        setAnchorEl(null)
        window.open(url)
      }
    })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={1}>
          {renderIcon()}
        </Grid>
        <Grid item xs={8}>
          <Typography>
            {props.fileName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>
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
    </div>
  )

}

export default File;