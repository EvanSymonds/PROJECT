import React, { useState, useEffect } from "react"
import axios from "axios"

var jwt = require("jsonwebtoken")

const UserDetails = (props) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (localStorage.getItem("authToken")) {

      const encrypted = window.localStorage.getItem("authToken")
      const token = jwt.decode(JSON.parse(encrypted))

      axios.get("http://localhost:3001/users/" + token.user_id).then((user) => {
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      })

    } else {

    }
  }, [])

  return (

    <div>

    </div>

  )

}

export default UserDetails