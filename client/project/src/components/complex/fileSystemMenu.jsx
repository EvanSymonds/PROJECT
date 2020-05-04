import React, { useState, useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/card"
import Grid from "@material-ui/core/grid"
import Divider from "@material-ui/core/divider"
import Button from "../basics/button"
import IconButton from "@material-ui/core/iconButton"
import { Add, Description, Folder } from "@material-ui/icons"
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

const FileSystemMenu = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
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

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            variant="contained"
          >
            <Add fontSize="default" />
          </IconButton>
          <Popper 
            open={open} 
            anchorEl={anchorRef.current} 
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
                      autoFocusItem={open} 
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
          />
        </Grid>
        <Grid
          item
        >
          <Button
            type="icon"
            icon="Fill"
            variant="contained"
            color="default"
            fillColor={props.fillColor}
          />
        </Grid>
        <Grid
          item
        >
          <Button
            type="icon"
            icon="TextColor"
            variant="contained"
            color="default"
            fillColor={props.textColor}
          />
        </Grid>
      </Grid>
      <Divider variant="middle" />
    </Card>

  )

}

export default FileSystemMenu