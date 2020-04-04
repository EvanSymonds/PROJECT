import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

const ProgressBar = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
    }
  }))

  const classes = useStyles()

  return (
    <React.Fragment>
      <div style={{
        height: 5,
        width: "100%",
        borderRadius: "5px",
      }} >
        <div className={classes.root} style={{
          height: "100%",
          width: props.progress + "%",
          borderRadius: "5px",
          margin: 0,
        }} />
      </div>
    </React.Fragment>
  )

}

export default ProgressBar;