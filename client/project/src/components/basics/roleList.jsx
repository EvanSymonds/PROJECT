import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/grid"
import Card from "@material-ui/core/card"
import Paper from "@material-ui/core/paper"
import Divider from "@material-ui/core/divider"
import axios from "axios"

const RoleList = (props) => {
  const [selected, setSelected] = useState(0)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: window.innerWidth > 1000 ? 400: 300,
    },
    role: {
      height: 50,
      display: "flex",
      alignItems: "center",
      paddingLeft: 20,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    },
    roleSelected: {
      height: 50,
      display: "flex",
      alignItems: "center",
      paddingLeft: 20,
      cursor: 'pointer',
      backgroundColor: theme.palette.secondary.light,
    }
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    setSelected(parseInt(event.target.id))
    props.onChange(event.target.id)
  }

  const renderRoles = () => {
    return props.roles.map((role, i) => {
      return (
        <div 
          key={i}
        >
          <Paper
            elevation={0}
            square
            onClick={handleChange}
            id={i}
            className={selected === i ? classes.roleSelected : classes.role}
          >
            {role.api_role}
          </Paper>
          <Divider light variant="middle"/>
        </div>
      )
    })
  }

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item>
        <Card
          square
          elevation={0}
          className={classes.root}
          value={selected}
        >
          {renderRoles()}
        </Card>
      </Grid>
      <Grid item>
        <Divider orientation="vertical"/>
      </Grid>
    </Grid>

  )

}

export default RoleList