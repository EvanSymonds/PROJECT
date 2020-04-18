import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"
import axios from "axios"

const ProfilePicture = (props) => {
  const [profilePicture, setProfilePicture] = useState("")

  const useStyles = makeStyles((theme) => ({
    root: {
      width: props.width,
      height: props.height
    }
  }));
  const classes = useStyles()

  useEffect(() => {
    const arrayBufferToBase64 = (buffer) => {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
    };

    axios.get("http://localhost:3001/profile_pictures/user/" + props.user_id).then((data) => {
      const base64Flag = 'data:image/png;base64,'
      const imageStr = arrayBufferToBase64(data.data.data.data)
      setProfilePicture(((base64Flag + imageStr).toString()))
    })
  }, [props.user_id])

  return (
    <div className={classes.root}>
      {profilePicture === "" ? null : <img src={profilePicture} className={classes.root}/>}
    </div>
  )

}

export default ProfilePicture