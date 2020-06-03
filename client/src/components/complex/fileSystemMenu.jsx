import React, { useState, useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/card"
import Grid from "@material-ui/core/grid"
import Divider from "@material-ui/core/divider"
import Button from "../basics/button"
import IconButton from "@material-ui/core/iconButton"
import { Add, Description, Folder, FormatColorFill } from "@material-ui/icons"
import Popper from '@material-ui/core/Popper';
import ColorPicker from "../basics/colorPicker"
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

const FileSystemMenu = (props) => {
  const [addOpen, setAddOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const addAnchorRef = useRef(null);
  const colorAnchorRef = useRef(null);

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: 4,
      marginBottom: 10,
      height: 60
    },
    grid: {
      marginLeft: 10
    },
    popper: {
      backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.light : theme.palette.background.default,
      boxShadow: theme.palette.type === "dark" ? 0 : '0px 0px 15px 5px rgba(34, 35, 58, 0.2)',
    }
  }))
  const classes = useStyles()

  const handleAddToggle = () => {
    setAddOpen((prevAddOpen) => !prevAddOpen);
  };

  const handleColorToggle = () => {
    setColorOpen((prevColorOpen) => !prevColorOpen);
  };

  const handleClose = (event) => {
    if (addAnchorRef.current && addAnchorRef.current.contains(event.target) || colorAnchorRef.current && colorAnchorRef.current.contains(event.target)) {
      return;
    }

    setAddOpen(false);
    setColorOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setAddOpen(false);
      setColorOpen(false);
    }
  }

  const handleClickUpload = (event) => {
    handleClose(event)
    props.onClickUpload()
  }

  const handleCreateFolder = (event) => {
    handleClose(event)
    props.onCreateFolder()
  }

  const handleAddAuth = () => {
    props.onAddAuth()
  }

  const onColorChange = (color) => {
    props.onColorChange(color)
    setColorOpen(false)
  }

  return (

    <Card
      className={classes.root}
      square
      elevation={0}
    >
      <Grid
        container
        className={classes.grid}
        spacing={3}
      >
        <Grid
          item
        >
          <IconButton
            ref={addAnchorRef}
            aria-controls={addOpen ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleAddToggle}
            variant="contained"
          >
            <Add fontSize="default" />
          </IconButton>
          <Popper
            open={addOpen} 
            anchorEl={addAnchorRef.current} 
            placement="bottom-start"
            role={undefined} 
            transition 
            disablePortal
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
              >
                <Paper className={classes.popper}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList 
                      autoFocusItem={addOpen} 
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left"
                      }}
                    >
                      <MenuItem 
                        onClick={handleClickUpload}
                      > 
                        <Description fontSize="large" color="secondary" style={{ marginRight: 10 }}/>
                        Add file
                      </MenuItem>
                      <MenuItem 
                        onClick={handleCreateFolder}
                      > 
                        <Folder fontSize="large" color="secondary" style={{ marginRight: 10 }}/>
                        Add folder
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
        <Grid
          item
        >
          <Button
            type="icon"
            icon="Lock"
            variant="contained"
            color="default"
            disabled={props.selectedFolder === null || props.selectedFolder.authorisation_level !== 0}
            onClick={handleAddAuth}
          />
        </Grid>
        <Grid
          item
        >
          <IconButton
            id="toolbar-element"
            disabled={props.selectedFolder === null}
            onClick={handleColorToggle}
            ref={colorAnchorRef}
            aria-controls={colorOpen ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
          >
            <FormatColorFill fontSize="default" id="toolbar-element"/>
            {props.selectedFolder !== null ? props.selectedFolder.folder_color !== null ? <div style={{
              width: 24,
              height: 4,
              background: props.selectedFolder.folder_color,
              position: "absolute",
              bottom: 12,
            }} /> : null : null}
          </IconButton>
          <Popper 
            open={colorOpen} 
            anchorEl={colorAnchorRef.current} 
            placement="bottom"
            role={undefined} 
            transition 
            disablePortal
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
              >
                <Paper className={classes.popper}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <div>
                      <ColorPicker colorChange={onColorChange}/>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
      <Divider variant="middle" />
    </Card>

  )

}

export default FileSystemMenu