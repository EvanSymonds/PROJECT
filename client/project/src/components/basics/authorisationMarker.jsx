import React from "react"
import { makeStyles } from "@material-ui/styles";
import { useTheme } from '@material-ui/core/styles';
import Card from "@material-ui/core/card"
import Button from "../basics/button"
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

const AuthorisationMarker = (props) => {
  const theme = useTheme()

  const useStyles = makeStyles((theme) => ({
    image: {
      width: props.mode === "edit" ? 75 : 50,
      height: props.mode === "edit" ? 75 : 50,
    },
    editCard: {
      position: "absolute",
      left: "50%",
      top: "50%",
      marginTop: "-50px",
      marginLeft: "-100px",
      width: 200,
      height: 100,
      borderRadius: 50,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }
  }))
  const classes = useStyles()

  const getImageSource = () => {

    switch (theme.palette.type){
      case "light":
        return "/static/images/authorisation-" + props.level + ".svg"
      case "dark":
        return "/static/images/authorisation-" + props.level + "-dark.svg"
    }
  }

  const onDecrease = () => {
    if (props.level > 0) {
      props.changeAuth(props.level - 1)
    }
  }

  const onIncrease = () => {
    if (props.level < 9) {
      props.changeAuth(props.level + 1)
    }
  }

  const renderMarker = () => {
    if (props.mode === "edit") {
      return (
        <Card
          className={classes.editCard}
        >
          <Button
            type="icon"
            icon="ArrowLeft"
            color="secondary"
            onClick={onDecrease}
          />
          {props.level === 0 ? <NoEncryptionIcon fontSize="large"/> : <img
            id={props.markerId}
            className={classes.image}
            src={getImageSource()}
          />}
          <Button
            type="icon"
            icon="ArrowRight"
            color="secondary"
            onClick={onIncrease}
          />
        </Card>
      )
    } else {
      return (
        <img
          id={props.markerId}
          className={classes.image}
          src={getImageSource()}
        />
      )
    }
  }

  return (

    <div>
      {renderMarker()}
    </div>

  )

}

export default AuthorisationMarker