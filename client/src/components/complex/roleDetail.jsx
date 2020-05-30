import React from "react"
import Card from "@material-ui/core/card"
import RoleUser from "../basics/roleUser"

const RoleDetail = (props) => {

  const renderUsers = () => {
    return props.role.api_role_users.map((user, i) => {
      if (user.user_id === -1) {
        return null
      } else {
        let userRole

        props.roles.forEach((role) => {
          if (role.api_role !== "change_role") {
            const pos = role.api_role_users.map((e) => {return e.username}).indexOf(user.username)
    
            if (pos !== -1) {
              userRole = role.api_role
            }
          }
        })

        return (
          <RoleUser
            rerender={props.rerender}
            project_id={props.project_id}
            roles={props.roles}
            role={props.role}
            user={user}
            userRole={userRole}
            key={i}
            onChangeMode={props.onChangeMode}
            onChangeRole={props.onChangeRole}
          />
        )
      }
    })
  }

  return (
    <Card
      square
      elevation={0}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {renderUsers()}
    </Card>
  )

}

export default RoleDetail