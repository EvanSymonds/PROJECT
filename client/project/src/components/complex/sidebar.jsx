import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from "../basics/button"
import Drawer from '@material-ui/core/Drawer';
import Paper from "@material-ui/core/Paper"
import Modal from '@material-ui/core/Modal';

const Sidebar = (props) => {
  const [permanent, setPermanent] = useState(window.innerWidth > 1000 ? true : false)
  const [open, setOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 250,
    },
    drawerPaper: {
      width: 250,
      height: "100%",
      background: theme.palette.secondary.light
    },
    menuButton: {
      display: "absolute",
      zIndex: 1,

    }
  }));
  const classes = useStyles();

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth <= 1000) {
      setPermanent(false)
      props.onResize()
    } else if (window.innerWidth > 1000) {
      setPermanent(true)
      props.onResize()
    }
  }
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSidebar = () => {
    if (permanent) {
      return (
        <Drawer
          className={classes.root}
          variant="permanent"
          anchor="left"
        >
          <Paper square className={classes.drawerPaper}>

          </Paper>
        </Drawer>
      )
    } else {
      return (
        <React.Fragment>
          <Button className={classes.menuButton} type="icon" icon="Menu" color="primary" onClick={handleOpen}/>
          <Modal
            open={open}
            onClose={handleClose}
          >
            <Drawer
              className={classes.root}
              variant="permanent"
              anchor="left"
            >
              <Paper square className={classes.drawerPaper}>

              </Paper>
            </Drawer>
          </Modal>
        </React.Fragment>
      )
    }
  }

  return (
    <div>
      {renderSidebar()}
    </div>
  )

}

export default Sidebar