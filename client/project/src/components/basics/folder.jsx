import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/card"
import FolderIcon from "@material-ui/icons/Folder"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import RenameProject from "../basics/renameProject"
import Modal from "@material-ui/core/modal"
import AuthorisationMarker from "../basics/authorisationMarker"
import { Edit, Delete, Lock } from "@material-ui/icons"
import axios from "axios"

import { connect } from "react-redux"
import { changeSettingsAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const initialState = {
  mouseX: null,
  mouseY: null,
};

const Folder = (props) => {
  const [state, setState] = React.useState(initialState);
  const [renameOpen, setRenameOpen] = useState(false)
  const [editAuth, setEditAuth] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 170,
      height: 200,
      backgroundColor: props.selected ? theme.palette.secondary.main : theme.palette.secondary.light,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    centralCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: props.authorisation_level !== 0 ? -35 : 40,
      backgroundColor: theme.palette.background.default,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    folderIcon: {
      fontSize: 40,
      color: theme.palette.secondary.main
    },
    name: {
      height: 30,
      width: 150,
      marginTop: 10,
      marginBottom: 10,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      textAlign: "center",
      fontSize: 18,
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
    authMarker: {
      marginLeft: 105,
      marginBottom: 15,
      marginTop: 5,
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
    arrowDropUp: {
      position: "relative",
      top: "-20px"
    }
  }))
  const classes = useStyles()

  const onSelect = () => {
    props.selectFolder(props.folder_id)
  }

  const onDeselect = (event) => {
    if (event === undefined) {
      props.selectFolder(null)
      return
    }
    if (event.target.id !== "folder-element" && event.target.parentNode.id !== "folder-element") {
      props.selectFolder(null)
    }
  }

  const handleClick = (event) => {
    props.selectFolder(props.folder_id)
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
    onDeselect()
  };

  const handleDoubleClick = () => {
    props.handleEnterFolder(props.folder_id, props.authorisation_level)
    onDeselect()
  }
  
  const handleRename = () => {
    setRenameOpen(true)
    handleClose()
  }

  const handleRenameClose = () => {
    setRenameOpen(false)
    props.rerender()
  }

  const handleDelete = () => {
    props.onDelete(props.folder_id)
    handleClose()
  }

  const onEditAuth = () => {
    setEditAuth(true)
  }

  const onChangeAuth = (new_auth) => {
    let formData = new FormData()
    formData.append("new_auth", new_auth)

    axios.post("http://localhost:3001/file_system/auth/" + props.folder_id, formData).then(() => {
      props.rerender()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const canEditAuth = () => {
    const encrypted = window.localStorage.getItem("authToken")
    const token = jwt.decode(JSON.parse(encrypted))
    
    if (token.authLevel >= props.projectSettings.editFilesAuth){
      return true
    } else {
      return false
    }
  }

  return (

    <div>
      <ClickAwayListener 
        onClickAway={onDeselect}
      >
        <Card
          id="folder-element"
          className={classes.root}
          onClick={onSelect}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleClick} 
          style={{ cursor: state.mouseY === null ? "pointer" : 'context-menu' }}
        >
          {props.authorisation_level !== 0 ? <div
          id="folder-element"
          className={classes.authMarker}>
            <AuthorisationMarker markerId="folder-element"
            level={props.authorisation_level}/>
          </div> : null}
          <div className={classes.centralCircle} id="folder-element">
            <FolderIcon className={classes.folderIcon} id="folder-element"/>
          </div>
          <div className={classes.name} id="folder-element">
            {props.folder_name}
          </div>
        </Card>
      </ClickAwayListener>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleRename} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <Edit style={{ marginRight: 10 }}/>
          Rename
        </MenuItem>
        {props.authorisation_level > 0 && canEditAuth() ? <MenuItem onClick={onEditAuth} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <Lock style={{ marginRight: 10 }}/>
          Edit authorisation
        </MenuItem> : null}
        <MenuItem onClick={handleDelete} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <Delete style={{ marginRight: 10 }}/>
          Delete
        </MenuItem>
      </Menu>
      <Modal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
      >
        <div>
          <RenameProject 
            close={handleRenameClose}
            defaultValue={props.folder_name}
            folder_id={props.folder_id}  
          />
        </div>
      </Modal>
      <Modal
        open={editAuth}
        onClose={() => setEditAuth(false)}
      >
        <div>
          <AuthorisationMarker
            mode="edit"
            level={props.authorisation_level}
            changeAuth={onChangeAuth}
          />
        </div>
      </Modal>
    </div>

  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth })(Folder)