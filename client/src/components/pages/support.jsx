import React, {useState} from "react";
import SupportForm from "../complex/supportForm"
import Sidebar from "../complex/sidebar"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const Support = () => {
  const [permanentSidebar, setPermanentSidebar] = useState(window.innerWidth > 1000 ? true : false)

  const useStyles = makeStyles((theme) => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: 16,
        backgroundColor: theme.palette.background.default,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.secondary.main,
        width: 6,
        border: "4px solid rgba(0, 0, 0, 0)",
        backgroundClip: "padding-box",
        borderRadius: 10
      }
    },
    page: {
      marginLeft: permanentSidebar ? 250 : 0,
      display: "flex",
      justifyContent: "center",
      paddingTop: 50,
    },
    background:{
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "calc(100% + 10px)"
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
      <div className={classes.page}>
        <SupportForm />
      </div>
    </Paper> 
  )
}

export default Support