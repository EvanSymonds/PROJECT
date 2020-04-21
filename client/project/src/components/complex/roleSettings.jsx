import React from "react"
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

export default RoleSettings