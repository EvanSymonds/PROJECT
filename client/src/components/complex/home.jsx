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
      marginTop: 100
    },
    title: {
      fontSize: 150,
    },
    subtitle: {
      fontSize: 75,
      marginLeft: 10,
      color: theme.palette.secondary.main
    },
    version: {
      fontSize: 20,
      transform: "rotate(-15deg)",
      position: "relative",
      width: 150,
      left: 700
    }
  }));
  const classes = useStyles();

  return (

    <div
      className={classes.root}
    >

      <img
        src="/static/images/HomeArt.png"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: 400,
          marginLeft: 40,
          marginBottom: 50
        }}
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