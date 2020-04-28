import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/grid"
import RoleList from "../complex/roleList"
import RoleDetail from "../complex/roleDetail"
import RoleSettings from "../complex/roleSettings"
import Divider from "@material-ui/core/divider"
import axios from "axios"

var jwt = require("jsonwebtoken")

const Team = (props) => {
  const [roles, setRoles] = useState([])
  const [selected, setSelected] = useState(0)
  const [mode, setMode] = useState("view")

  useEffect(() => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))

    console.log(token)

    if (token.authLevel === 9) {
      setMode("admin")
    }
  }, [])

  const getAllRoles = () => {
    axios.get("http://localhost:3001/roles/allusers/" + props.project_id).then((rolesWithUsers) => {
      let api_roles = []

      rolesWithUsers.data.forEach((roleWithUser) => {

        if (api_roles.indexOf(roleWithUser.role.role_name) === -1) {
          api_roles = [...api_roles, roleWithUser.role.role_name]
        }
      })

      let final_roles = []
      let allUsers = []

      api_roles.forEach((api_role) => {
        let api_role_users = []

        rolesWithUsers.data.forEach((roleWithUser) => {

          if (roleWithUser.role.role_name === api_role) {
            if (roleWithUser.role.user_id === "-1") {
              api_role_users = [...api_role_users, {username: "PLACEHOLDER", user_id: -1, role_id: roleWithUser.role.role_id}]
            } else {
              allUsers = [...allUsers, {username: roleWithUser.user[0].username, user_id: roleWithUser.user[0].user_id,
                role_id: roleWithUser.role.role_id
                }]

              api_role_users = [...api_role_users, {username: roleWithUser.user[0].username, user_id: roleWithUser.user[0].user_id,
              role_id: roleWithUser.role.role_id
              }]
            }
          }

        })

        final_roles = [...final_roles, {api_role, api_role_users}]
      })

      final_roles = [...final_roles, {api_role: "change_role", api_role_users: allUsers}]

      setRoles(final_roles)

    })
  }
  useEffect(() => {
    getAllRoles()
  }, [])

  const onChangeRole = (role) => {
    setSelected(parseInt(role))
  }

  const onChangeMode = () => {
    setSelected(roles.length - 1)
  }

  const onDeleteRole = (role) => {
    axios.delete("http://localhost:3001/roles", {data: {role_name: role, project_id: props.project_id}}).then(() => {
      setSelected(selected => selected === 0 ? 0 : selected - 1)
      getAllRoles()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onAddRole = () => {
    getAllRoles()
  }

  const handleChangeUserRole = (role_id, newRole) => {

    let formData = new FormData()
    formData.append("role_id", role_id)
    formData.append("new_name", newRole)
    formData.append("project_id", props.project_id)

    axios.post("http://localhost:3001/roles/update", formData).then((response) => {
      getAllRoles()
    })
    .catch((error) => {
      console.log(error)
    })
  }   

  return (

    <Grid
      container
      direction="row"
      style={{
        height: "100%",
        width: "100%",
      }}>
      <Grid item>
        <RoleList 
          selected={selected}
          project_id={props.project_id}
          onChange={onChangeRole}
          roles={roles}
          onAddRole={onAddRole}
          mode={mode}
          onChangeMode={onChangeMode}
        />
      </Grid>
      <Grid item>
        <Divider orientation="vertical"/>
      </Grid>
      <Grid item style={{
        width: window.inner < 1000 ? 500 :
        window.innerWidth < 1150 ? 450 :
        window.innerWidth < 1400 ? 500 :
        700
      }}>
        {roles.length === 0 ? null : <RoleDetail 
          role={roles[selected]}
          roles={roles}
          project_id={props.project_id}
          onChangeRole={handleChangeUserRole}
          handleDelete={onDeleteRole}
          mode={mode}
          onChangeMode={selected === roles.length -1 ? true : false}
        />}
      </Grid>
      <Grid item>
        <Divider orientation="vertical"/>
      </Grid>
      <Grid item>
        {roles.length === 0 ? null : <RoleSettings 
          handleDelete={onDeleteRole}
          role={roles[selected].api_role}
          mode={mode}
        />}
      </Grid>
    </Grid>

  )

}

export default Team