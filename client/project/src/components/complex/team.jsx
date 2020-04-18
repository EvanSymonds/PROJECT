import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/grid"
import RoleList from "../basics/roleList"
import RoleDetail from "../complex/roleDetail"
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios"

const Team = (props) => {
  const [roles, setRoles] = useState([])
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    axios.get("http://localhost:3001/roles/allusers/" + props.project_id).then((rolesWithUsers) => {
      let api_roles = []

      rolesWithUsers.data.forEach((roleWithUser) => {

        if (roles.indexOf(roleWithUser.role.role_name === -1)) {
          api_roles = [...api_roles, roleWithUser.role.role_name]
        }
      })

      let final_roles = []

      api_roles.forEach((api_role, i) => {
        let api_role_users = []

        rolesWithUsers.data.forEach((roleWithUser) => {

          if (roleWithUser.role.role_name === api_role) {
            api_role_users = [...api_role_users, {username: roleWithUser.user[0].username, user_id: roleWithUser.user[0].user_id}]
          }

        })

        final_roles = [...final_roles, {api_role, api_role_users}]
      })

      setRoles(final_roles)

    })
  }, [])

  const useStyles = makeStyles((theme) => ({
  }));
  const classes = useStyles();

  const onChangeRole = (role) => {
    setSelected(parseInt(role))
  }

  return (

    <Grid
      container
      direction="row"
      justify="center"
      style={{
        height: "100%",
        width: "100%",
      }}>
      <Grid item>
        <RoleList onChange={onChangeRole} roles={roles}/>
      </Grid>
      <Grid item xs style={{ width: "100%" }}>
        {roles.length === 0 ? null : <RoleDetail users={roles[selected].api_role_users} project_id={props.project_id}/>}
      </Grid>
    </Grid>

  )

}

export default Team