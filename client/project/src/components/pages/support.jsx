import React, {useState} from "react";
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const Support = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)

  const useStyles = makeStyles((theme) => ({
    root: {
      height: permanentSidebar ? window.innerHeight : window.innerHeight - 96,
      marginLeft: permanentSidebar ? 250 : 0
    },
    background:{
      height: window.innerHeight,
    }
  }));
  const classes = useStyles();
  const history = useHistory();

  const onResize = () => {
    if (window.innerWidth <= 1000){
      setPermanentSidebar(false)
    } else if (window.innerWidth > 1000) {
      setPermanentSidebar(true)
    }
  }

  return (
    <Paper square className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.root}>
      </div>
    </Paper> 
  )
}

export default Support