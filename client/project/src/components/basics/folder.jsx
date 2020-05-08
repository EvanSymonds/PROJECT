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
import { Edit, Delete } from "@material-ui/icons"

const initialState = {
  mouseX: null,
  mouseY: null,
};

const Folder = (props) => {
  const [selected, setSelected] = useState(false)
  const [state, setState] = React.useState(initialState);
  const [renameOpen, setRenameOpen] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 170,
      height: 200,
      backgroundColor: selected ? theme.palette.secondary.main : theme.palette.secondary.light,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    centralCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: props.authorisation_level !== 0 ? -30 : 30,
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
      marginBottom: 10,
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    }
  }))
  const classes = useStyles()

  const onSelect = () => {
    setSelected(true)
    props.selectFolder(props.folder_id)
  }

  const onDeselect = (event) => {
    if (event === undefined) {
      setSelected(false)
      props.selectFolder(null)
      return
    }
    if (event.target.id !== "folder-element") {
      setSelected(false)
      props.selectFolder(null)
    }
  }

  const handleClick = (event) => {
    event.preventDefault();
    setSelected(true)
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
            <AuthorisationMarker markerId="folder-element" level={props.authorisation_level}/>
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
    </div>

  )

}

export default Folder