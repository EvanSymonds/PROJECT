import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';

const Home = (props) => {
  const [scrollPos, setScrollPos] = useState(0)

  const useStyles = makeStyles((theme) => ({
    root: {
      
    },
    slidoverRight: {
      width: 1000,
      height: 600,
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
    },
    slidoverLeft: {
      width: 1000,
      height: 800,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    }
  }));
  const classes = useStyles();

  useEffect(() => {
    getScrollPos()
    window.addEventListener("scroll", getScrollPos)
    
    return () => window.removeEventListener("scroll", getScrollPos)
  }, [])

  const getScrollPos = () => {

    setScrollPos(document.body.scrollTop || document.documentElement.scrollTop)

  }


  return (

    <div>
    </div>

  )

}

export default Home