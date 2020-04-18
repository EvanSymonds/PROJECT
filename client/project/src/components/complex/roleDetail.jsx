import React from "react"
import Card from "@material-ui/core/card"
import RoleUser from "../basics/roleUser"
import { makeStyles } from '@material-ui/core/styles';

const RoleDetail = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
    }
  }));
  const classes = useStyles();

  const onChangeRole = (user_id, newRole) => {
    props.onChangeRole(props.role, user_id, newRole)
  }

  const renderUsers = () => {
    return props.users.map((user, i) => {
      if (user.user_id === -1) {
        return null
      } else {
        return (
          <RoleUser roles={props.roles} user={user} key={i} onChangeRole={onChangeRole}/>
        )
      }
    })
  }

  return (

    <Card
      square
      elevation={0}
      className={classes.root}
    >
      {renderUsers()}
    </Card>

  )

}

export default RoleDetail