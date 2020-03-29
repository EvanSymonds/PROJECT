import React, { useState } from "react";
import Dropzone from 'react-dropzone';
import Button from "../basics/button";
import { makeStyles } from "@material-ui/styles";

const DropzoneComponent = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.secondary.main
    }
  }))

  const onDrop = (e) => {
    return(e)
  }

  const classes = useStyles()

  return (
    <div>
      <Dropzone 
        className="circle"
        onDrop={onDrop}
        multiple={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} 
            className={classes.root}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 150,
              height: 150,
              borderRadius: 75,
              borderWidth: 2,
              borderStyle: 'dashed'
            }}>
              <div>
                <input id="icon-button-file" type="file"
                 style={{ display: "none" }}/>
                <label
                  htmlFor="icon-button-file">
                  <Button type="icon" color ="secondary" icon="CloudUpload" size="large" aria-label="upload picture" component="span"/>
                </label>
              </div>
              <div>
                Upload files
              </div>
            </div>
          )}
      </Dropzone>
    </div>
  )

}

export default DropzoneComponent;