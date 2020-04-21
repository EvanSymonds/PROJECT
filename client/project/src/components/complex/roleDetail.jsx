import React from "react"
import Card from "@material-ui/core/card"
import Grid from "@material-ui/core/grid"
import RoleUser from "../basics/roleUser"
import Divider from "@material-ui/core/divider"
import { makeStyles } from '@material-ui/core/styles';

const RoleDetail = (props) => {

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

    <Grid container style={{ height: "100%" }}>
      <Grid item>
        <Card
            square
            elevation={0}
            style={{
              width: window.innerWidth < 1000 ? 400 : window.innerWidth < 1100 ? 300 : window.innerWidth < 1500 ? 500 : 800,
            }}
          >
            {renderUsers()}
        </Card>
      </Grid>
      <Grid item>
        <Divider orientation="vertical"/>
      </Grid>
    </Grid>

  )

}

export default RoleDetail