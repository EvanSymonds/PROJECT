import React, { useMemo } from "react";
import { useTheme } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import Button from "../basics/button";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { useCallback } from "react";

const DropzoneComponent = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      color: theme.palette.secondary.dark,
    },
    disabled: {
      color: theme.palette.secondary.light
    },
    active: {
      borderColor: theme.palette.primary
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

  const onDrop = useCallback(files => {
    props.onDrop(files)
  })

  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderStyle: 'dashed',
    margin: "30px",
  }

  const activeStyle = {
    borderColor: theme.palette.primary.main,
  }

  const {getRootProps, isDragActive} = useDropzone({onDrop})

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
  }), [
    isDragActive,
  ]);

  return (
    <div data-test="component-dropzone" {...getRootProps({style})} 
    className={getColor()}>
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
  )

}

export default DropzoneComponent;