import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import ButtonBase from '@material-ui/core/ButtonBase';

const Logo = (props) => {

  const image = {
    url: "/static/images/logo.png",
    name: "Logo",
    width: 300,
    height: 300
  }

  const useStyles = makeStyles((theme) => ({
    button: {
      position: 'relative',
      height: image.height / 3,
      width: image.width / 3,
    },
    image: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }));
  const classes = useStyles()
  const history = useHistory()

  return (
    <div>
      <ButtonBase 
        disableRipple
        className={classes.button}
        onClick={() => history.push("/")}
      >
        <span
          className={classes.image}
          style={{
            backgroundImage: `url(${image.url})`
          }}
        />
      </ButtonBase>
    </div>
  )

}

export default Logo