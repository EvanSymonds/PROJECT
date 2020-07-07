import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';

const Home = (props) => {
  const [scrollPos, setScrollPos] = useState(0)

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "10%"
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "40%",
      height: "100%",
      marginLeft: "3%",
    },
    crates: {
      width: "20%"
    },
    title: {
      fontSize: "8vw",
    },
    subtitle: {
      fontSize: "3vw",
      marginLeft: 10,
      color: theme.palette.secondary.main
    },
    version: {
      fontSize: "1.5vw",
      transform: "rotate(-15deg)",
      position: "relative",
      width: "30%",
      left: "80%"
    }
  }));
  const classes = useStyles();

  return (

    <div
      className={classes.root}
    >

      <img
        className={classes.crates}
        src="/static/images/HomeArt.png"
      />
      <div
        className={classes.container}
      >
        <div
          className={classes.title}
        >
          CrateLab
        </div>
        <div
          className={classes.subtitle}
        >
          One place for projects
        </div>
        <div
          className={classes.version}
        >
          (Pre-alpha 0.1)
        </div>
      </div>

    </div>

  )

}

export default Home