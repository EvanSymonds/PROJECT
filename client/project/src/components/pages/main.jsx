import React, {useState} from "react";
import FileSystem from "../complex/fileSystem"
import Sidebar from "../complex/sidebar"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const Main = (props) => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)

  const useStyles = makeStyles((theme) => ({
    root: {
      height: permanentSidebar ? window.innerHeight : window.innerHeight - 96,
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

  return(
    <div className={classes.background}>
      <Sidebar onResize={onResize}/>
      <div className={classes.root}>
        <FileSystem />
      </div>
    </div>
  )
}

export default Main;