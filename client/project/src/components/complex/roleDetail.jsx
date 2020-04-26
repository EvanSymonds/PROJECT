import React from "react"
import Card from "@material-ui/core/card"
import Grid from "@material-ui/core/grid"
import RoleUser from "../basics/roleUser"
import RoleSettings from "./roleSettings"

const RoleDetail = (props) => {

  const onChangeRole = (role_id, newRole) => {
    props.onChangeRole(role_id, newRole)
  }

  const renderUsers = () => {
    return props.role.api_role_users.map((user, i) => {
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
    <Grid

    >
      <Grid item>
        <Card
          square
          elevation={0}
        >
          {renderUsers()}
        </Card>
      </Grid>
      <Grid item>
        <RoleSettings 
          handleDelete={props.handleDelete}
          role={props.role.api_role}
        />
      </Grid>
    </Grid>
  )

}

export default RoleDetail