import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/grid"
import Card from "@material-ui/core/card"
import Paper from "@material-ui/core/paper"
import Divider from "@material-ui/core/divider"
import Modal from "@material-ui/core/modal"
import Button from "../basics/button"
import CreateRole from "../basics/createRole"

const RoleList = (props) => {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: window.innerWidth < 1000 ? 300 : window.innerWidth < 1400 ? 250 : 400
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

  const onAddRole = (role_name) => {
    props.onAddRole(role_name)
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item>
        <Card
          style={{ height: window.innerHeight - 142 }}
          square
          elevation={0}
          className={classes.root}
          value={selected}
        >
          {renderRoles()}
        </Card>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Button type="normal" variant="outlined" color="primary" buttonText="New role" onClick={handleOpen}/>
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
      <Grid item>
        <Divider orientation="vertical"/>
      </Grid>
    </Grid>

  )

}

export default RoleList