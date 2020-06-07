import React, { useState, useEffect, useRef } from "react"
import useDimensions from 'react-use-dimensions';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import FolderIcon from "@material-ui/icons/Folder"
import Popper from "@material-ui/core/Popper"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import RenameProject from "./renameProject"
import Grow from '@material-ui/core/Grow';
import ColorPicker from "./colorPicker"
import Modal from "@material-ui/core/Modal"
import AuthorisationMarker from "../basics/authorisationMarker"
import { Edit, Delete, Lock, FormatColorFill } from "@material-ui/icons"
import axios from "axios"
import { connect } from "react-redux"
import { changeSettingsAuth } from "../../actions"

var jwt = require("jsonwebtoken")

const initialState = {
  mouseX: null,
  mouseY: null,
};

const Folder = (props) => {
  const [state, setState] = useState(initialState);
  const [renameOpen, setRenameOpen] = useState(false)
  const [editAuth, setEditAuth] = useState(false)
  const [colorOpen, setColorOpen] = useState(false);
  const [hover, setHover] = useState(false)
  const [ref, position] = useDimensions();
  const [translate, setTranslate] = useState({
    isDragging: false,
    translateX: null,
    translateY: null
  })
  const colorAnchorRef = useRef(null);

  useEffect(() => {
    setTranslate({
      ...translate,
      translateX: position.x,
      translateY: position.y
    })
  }, [position])

  const handleMouseMove = ev => {
    if (translate.isDragging) {
      setTranslate(prevTranslate => ({
        ...prevTranslate,
        translateX: ev.clientX,
        translateY: ev.clientY
      }));
    } else {
      if (props.listenForDrag !== false) {
        if (ev.clientX >= position.x && ev.clientX <= position.x + 170) {
          if (ev.clientY >= position.y && ev.clientY <= position.y + 200) {
            setHover(true)
          } else {
            setHover(false)
          }
        } else {
          setHover(false)
        }
      }
    }
  }

  const handleMouseUp = ev => {
    if (translate.isDragging) {
      setTranslate(prevTranslate => ({
        ...prevTranslate,
        isDragging: false
      }))
      props.onDragStop()
    }
    if (props.listenForDrag) {
      if (hover) {
        handleAddFile(props.listenForDrag)
      }
    }
  }
  
  const handleDragStart = (event) => {
    event.preventDefault()
    setTranslate({...translate, isDragging: true})
    props.onDragStart({id: props.folder_id, type: "folder"})
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove)
    };
  }, [handleMouseUp, handleMouseMove]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 170,
      height: 200,
      backgroundColor: props.selected || hover && props.listenForDrag !== false ? theme.palette.secondary.main : theme.palette.secondary.light,
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
      color: props.folderColor === null ? theme.palette.secondary.main : props.folderColor
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
    },
    draggable: {
      backgroundColor: theme.palette.secondary.light
    }
  }))
  const classes = useStyles()

  const handleAddFile = (child) => {
    if (child.id !== props.folder_id) {
      let formData = new FormData()
      formData.append("child_id", parseInt(child.id))
      formData.append("type", child.type)

      axios.post("/api/file_system/" + props.folder_id, formData).then(() => {
        props.rerender()
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }

  const onSelect = () => {
    props.selectFolder(props.folder_id)
  }

  const onDeselect = (event) => {
    if (event !== undefined) {
      if (event.target.id !== "folder-element" && event.target.parentNode.id !== "folder-element" && event.target.id !== "toolbar-element" && event.target.parentNode.id !== "toolbar-element") {
        props.selectFolder(null)
      }
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

  const handleEditAuthOpen = () => {
    setEditAuth(true)
    handleClose()
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

  const handleCloseColor = (event) => {
    if (colorAnchorRef.current && colorAnchorRef.current.contains(event.target)) {
      return;
    }

    setColorOpen(false);
  };

  const onChangeAuth = (new_auth) => {
    let formData = new FormData()
    formData.append("new_auth", new_auth)

    axios.post("/api/file_system/auth/" + props.folder_id, formData).then(() => {
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
      {translate.isDragging ? <Card
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          width: 168,
          height: 198,
        }}
      /> : null }
      <div
        onDragStart={handleDragStart}
        style={{
          position: translate.isDragging && translate.translateX !== null ? "absolute" : null,
          left: translate.translateX,
          top: translate.translateY
        }}
        draggable
      >
        {!translate.isDragging ?
          <div ref={ref} >
            <ClickAwayListener 
              onClickAway={onDeselect}
            >
              <Card
                ref={colorAnchorRef}
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
                  <AuthorisationMarker
                    level={props.authorisation_level}
                    onChangeAuth={onChangeAuth}
                    mode="view"
                  />
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
              disableScrollLock
              open={state.mouseY !== null && canEditAuth()}
              id="folder-element"
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
              <MenuItem 
                onClick={props.authorisation_level > 0 ? handleEditAuthOpen : props.onAddAuth}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Lock style={{ marginRight: 10 }}/>
                {props.authorisation_level > 0 ? "Edit authorisation" : "Add authorisation"}
              </MenuItem>
              <MenuItem onClick={handleDelete} style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}>
                <Delete style={{ marginRight: 10 }}/>
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => { setColorOpen(true); handleClose() }}
                id="folder-element"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <FormatColorFill 
                  fontSize="default"
                  id="toolbar-element"
                  style={{ marginRight: 10 }}
                />
                {props.selectedFolder !== null? <div style={{
                  width: 24,
                  height: 4,
                  background: props.selectedFolder.folder_color,
                  position: "absolute",
                  bottom: 6,
                }} /> : null}
                Color
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
              disablePortal
            >
              <div>
                <AuthorisationMarker
                  mode="edit"
                  level={props.authorisation_level}
                  onChangeAuth={onChangeAuth}
                />
              </div>
            </Modal>
            <Popper 
              open={colorOpen} 
              anchorEl={colorAnchorRef.current}
              id="folder-element"
              placement="right"
              role={undefined} 
              transition 
              disablePortal
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                >
                  <Paper className={classes.popper}>
                    <ClickAwayListener onClickAway={handleCloseColor}>
                      <div>
                        <ColorPicker colorChange={props.onColorChange}/>
                      </div>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>

          :

          <div>
            <Paper
              style={{ padding: 5 }}
              draggable
              className={classes.draggable}
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
              >
                <Grid
                  item
                  style={{ marginRight: 5 }}
                >
                  <FolderIcon fontSize="large" color="secondary" />
                </Grid>
                <Grid
                  item
                >
                  <div>
                    {props.folder_name}
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </div>

        }
      </div>
    </div>

  )

}

const mapStateToProps = state => {
  return { projectSettings: state.projectSettings }
}

export default connect(mapStateToProps, { changeSettingsAuth })(Folder)