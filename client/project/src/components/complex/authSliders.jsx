import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import Slider from '../basics/slider';

const AuthSliders = (props) => {

  const useStyles = makeStyles({
    root: {
      
    },
  });
  const classes = useStyles()


  return (
    <div className={classes.root}>
      <Slider />
    </div>
  )
  
}

export default AuthSliders