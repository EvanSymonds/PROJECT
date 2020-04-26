import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/grid"
import RoleList from "../complex/roleList"
import RoleDetail from "../complex/roleDetail"
import RoleSettings from "../complex/roleSettings"
import axios from "axios"

const Team = (props) => {
  const [roles, setRoles] = useState([])
  const [selected, setSelected] = useState(0)

  const getAllRoles = () => {
    axios.get("http://localhost:3001/roles/allusers/" + props.project_id).then((rolesWithUsers) => {
      let api_roles = []

      rolesWithUsers.data.forEach((roleWithUser) => {

        if (api_roles.indexOf(roleWithUser.role.role_name) === -1) {
          api_roles = [...api_roles, roleWithUser.role.role_name]
        }
      })

      let final_roles = []

      api_roles.forEach((api_role) => {
        let api_role_users = []

        rolesWithUsers.data.forEach((roleWithUser) => {

          if (roleWithUser.role.role_name === api_role) {
            if (roleWithUser.role.user_id === "-1") {
              api_role_users = [...api_role_users, {username: "PLACEHOLDER", user_id: -1, role_id: roleWithUser.role.role_id}]
            } else {
              api_role_users = [...api_role_users, {username: roleWithUser.user[0].username, user_id: roleWithUser.user[0].user_id,
              role_id: roleWithUser.role.role_id
              }]
            }
          }

        })

        final_roles = [...final_roles, {api_role, api_role_users}]
      })

      setRoles(final_roles)

    })
  }

  useEffect(() => {
    getAllRoles()
  }, [])

  const onChangeRole = (role) => {
    setSelected(parseInt(role))
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
      console.log(error.response)
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
        <RoleList selected={selected} project_id={props.project_id} onChange={onChangeRole} roles={roles} onAddRole={onAddRole}/>
      </Grid>
      <Grid item>
        {roles.length === 0 ? null : <RoleDetail 
          role={roles[selected]}
          roles={roles}project_id={props.project_id}
          onChangeRole={handleChangeUserRole}
          handleDelete={onDeleteRole}
        />}
      </Grid>
    </Grid>

  )

}

export default Team