import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"
import { Edit } from '@material-ui/icons/';
import Modal from "@material-ui/core/modal"
import FileUpload from "../complex/fileUpload"
import { AccountCircle } from "@material-ui/icons"
import axios from "axios"

const ProfilePicture = (props) => {
  const [profilePicture, setProfilePicture] = useState("")
  const [uploading, setUploading] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: props.width,
      height: props.height,
      borderRadius: props.shape === "circle" ? props.width / 2 : 0,
      overflow: "hidden",
      cursor: props.mode === "edit" ? "pointer" : "auto",
      opacity: props.mode === "edit" ? 0.8 : 1,
      backgroundColor: theme.palette.background.default
    },
    edit: {
      width: props.width,
      height: props.height / 3,
      backgroundColor: theme.palette.secondary.main,
      opacity: 0.8,
      marginTop: -(props.height / 3 + 4),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: props.height / 5
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
    .catch((error) => {
      setProfilePicture("")
      console.log(error)
    })
  }, [props.user_id])

  const updateProfilePicture = () => {
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
    .catch((error) => {
      setProfilePicture("")
      console.log(error)
    })
  }

  return (
    <React.Fragment>
      <div
        className={classes.root}
        onClick={() => props.mode === "edit" ? setUploading(true) : null}
      >
        {profilePicture === "" ? 
        <AccountCircle className={classes.root} color="secondary"/>
        : 
        <img src={profilePicture} className={classes.root}/>}
        {props.mode === "edit" ? 
          <div 
            className={classes.edit}
          >
            <Edit fontSize="inherit"/>
          </div>
        : null }
      </div>
      <Modal
        open={uploading}
        onClose={() => setUploading(false)}
      >
        <div>
          <FileUpload 
            updateParent={updateProfilePicture}
            credentialType="user_id"
            credential={props.credential}
            maxFiles={1}
            endpoint="/profile_pictures"  
          />
        </div>
      </Modal>
    </React.Fragment>
  )

}

export default ProfilePicture