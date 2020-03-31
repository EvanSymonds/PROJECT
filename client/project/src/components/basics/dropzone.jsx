import React, { useState } from "react";
import { useTheme } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';
import Button from "../basics/button";
import { makeStyles, ThemeProvider } from "@material-ui/styles";

const DropzoneComponent = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.secondary.main,
    },
    disabled: {
      color: theme.palette.secondary.light
    }
  }))

  const classes = useStyles()
  const theme = useTheme()

  const getColor = () => {
    if (props.disabled === false) {
      return classes.root
    } else {
      return classes.disabled
    }
  }

  const handleChange = (e) => {
    props.onDrop(e.target.files)
  }

  return (
    <div>
      <Dropzone 
        className="circle"
        onDrop={props.onDrop}
        disabled={props.disabled}
        multiple={false}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} 
            className={getColor()}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 150,
              height: 150,
              borderRadius: 75,
              borderWidth: 2,
              borderStyle: 'dashed',
              margin: "30px"
            }}>
              <div>
                <input disabled={props.disabled} onChange={handleChange} id="icon-button-file" type="file"
                 style={{ display: "none" }}/>
                <label
                  htmlFor="icon-button-file">
                    <ThemeProvider theme={theme}>
                      <Button disabled={props.disabled} type="icon" icon="GetApp" size="large" aria-label="upload picture" component="span" />
                    </ThemeProvider>
                </label>
              </div>
              <div className={getColor()}>
                Upload files
              </div>
            </div>
          )}
      </Dropzone>
    </div>
  )

}

export default DropzoneComponent;