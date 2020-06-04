import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Button from "../basics/button"
import Grid from "@material-ui/core/grid"
import ValueSelect from "../basics/valueSelect"

const RoleSettings = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: 10,
    }
  }));
  const classes = useStyles();

  const handleDelete = () => {
    props.handleDelete(props.role.api_role)
  }

  const onAuthChange = (newValue) => {

    if (props.role.api_role_users[0].authorisation_level === 9) {
      const adminRoles = props.roles.filter((role) => role.api_role_users[0].authorisation_level === 9)
      
      if (adminRoles.length === 1) {
        return
      }
    }
    props.handleUpdateAuth(props.role.api_role, newValue)
  }

  const renderSettings = () => {
    if (props.role.api_role === "change_role") {
      return null
    }

    switch (props.mode) {
      case "view":
        return (
          <Grid 
            container 
            className={classes.root}
            direction="column"
            alignItems="center"
          >
            <Grid item style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}>
              <div style={{
                height: 20,
                width: 'calc(100% - 110px)'
              }}>
                Authorisation level
              </div>
              <ValueSelect 
                value={props.role.api_role_users[0].authorisation_level}
                disabled
                maxValue={9}
                minValue={1}
                onChange={onAuthChange}
              />
            </Grid>
          </Grid>
        )
      case "admin":
        return (
          <Grid 
            container 
            className={classes.root}
            direction="column"
            alignItems="center"
          >
            <Grid item style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}>
              <div style={{
                height: 20,
                width: 'calc(100% - 110px)'
              }}>
                Authorisation level
              </div>
              <ValueSelect 
                value={props.role.api_role_users[0].authorisation_level}
                maxValue={9}
                minValue={1}
                onChange={onAuthChange}
              />
            </Grid>
            <Grid item style={{ 
              display: "flex",
              justifyContent: "center",
              padding: 10,
              marginTop: 20,
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