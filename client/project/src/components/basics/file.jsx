import React, { useState } from "react";
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import LayersIcon from '@material-ui/icons/Layers';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import Button from "../basics/button"
import axios from "axios"
import FileDownload from "js-file-download"

const File = (props) => {
  const imageFileTypes = ["jpg", "png", "jpeg"]
  const textFileTypes = ["txt", "docx"]
  const modelFileTypes = ["stl", "3ds", "f3d"]

  const renderIcon = () => {
    if (imageFileTypes.indexOf(props.fileType) > -1) {
      return <ImageIcon fontSize="large" color="secondary" />
    } else if (textFileTypes.indexOf(props.fileType)> -1) {
      return <DescriptionIcon fontSize="large" color="secondary" />
    } else if (modelFileTypes.indexOf(props.fileType) > -1) {
      return <LayersIcon fontSize="large" color="secondary"/>
    }
  }

  const onDownload = () => {

    const url = "http://localhost:3001/files/" + props.file_id
    axios.get(url).then((response) => {
      window.open(url)
    })
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={1}>
        {renderIcon()}
      </Grid>
      <Grid item xs={7}>
        <Typography>
          {props.fileName}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography>
          {props.fileType}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Button type="icon" icon="GetApp" color="secondary" onClick={onDownload}/>
      </Grid>
    </Grid>
  )

}

export default File;