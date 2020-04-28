import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Button from "../basics/button"
import Grid from "@material-ui/core/grid"

const RoleSettings = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: 20,
    }
  }));
  const classes = useStyles();

  const handleDelete = () => {
    props.handleDelete(props.role)
  }

  const renderSettings = () => {
    if (props.role === "change_role") {
      return null
    }

    switch (props.mode) {
      case "view":
        return (
          <Grid container className={classes.root}>
          <Grid item style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            
          </Grid>
        </Grid>
        )
      case "admin":
        return (
          <Grid container className={classes.root}>
          <Grid item style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Button type="normal" variant="outlined" buttonText="Delete role" color="primary" onClick={handleDelete} />
          </Grid>
        </Grid>
        )
    }
  }

  return (

    <div>
      {renderSettings()}
    </div>

  )

}

export default RoleSettings