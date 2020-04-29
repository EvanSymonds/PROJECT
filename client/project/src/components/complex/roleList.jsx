import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/grid"
import Card from "@material-ui/core/card"
import Paper from "@material-ui/core/paper"
import Divider from "@material-ui/core/divider"
import Modal from "@material-ui/core/modal"
import Button from "../basics/button"
import CreateRole from "../basics/createRole"
import { Edit } from "@material-ui/icons"

const RoleList = (props) => {
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
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
    changeRoles: {
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light
      }
    },
    changeRolesSelected: {
      height: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: 'pointer',
      backgroundColor: theme.palette.secondary.light,
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
    props.onChange(event.target.id)
  }

  const onAddRole = (role_name) => {
    props.onAddRole(role_name)
  }

  const renderRoles = () => {
    return props.roles.map((role, i) => {
      if (i !== props.roles.length - 1) {
        return (
          <div 
            key={i}
          >
            <Paper
              elevation={0}
              square
              onClick={handleChange}
              id={i}
              className={props.selected === i ? classes.roleSelected : classes.role}
            >
              {role.api_role}
            </Paper>
            <Divider light variant="middle"/>
          </div>
        )
      }
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item style={{ width: "100%" }}>
        <Card
          style={{ height: window.innerHeight - (props.mode === "admin" ? 200 : 142) }}
          square
          elevation={0}
          className={classes.root}
          value={props.selected}
        >
          {renderRoles()}
        </Card>
        {props.mode === "admin" ? <Card
          className={props.selected === props.roles.length - 1 ? classes.changeRolesSelected : classes.changeRoles}
          elevation={0}
          square
          onClick={props.onChangeMode}
        >
          Change roles
          <Edit style={{ marginLeft: 10 }} color="primary"/>
        </Card> : null}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10
        }}>
          {props.mode === "admin" ? <Button type="normal" variant="contained" color="primary" buttonText="New role" onClick={handleOpen}/> : null}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <div>
            <CreateRole project_id={props.project_id} onAddRole={onAddRole}/>
          </div>
        </Modal>
      </Grid>
    </Grid>

  )

}

export default RoleList