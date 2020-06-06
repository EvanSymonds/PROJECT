import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from '@material-ui/core/styles';
import useDebounce from "../../hooks/useDebounce"
import Card from "@material-ui/core/Card"
import Button from "../basics/button"
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

const AuthorisationMarker = (props) => {
  const [authorisationLevel, setAuthorisationLevel] = useState(props.level)
  const theme = useTheme()

  const debouncedAuthLevel = useDebounce(authorisationLevel, 150)

  useEffect(() => {
      props.onChangeAuth(authorisationLevel)
  },[debouncedAuthLevel])

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
        if (props.mode === "edit") {
          return "/static/images/authorisation-" + authorisationLevel + ".svg"
        } else {
          return "/static/images/authorisation-" + props.level + ".svg"
        }
      case "dark":
        if (props.mode === "edit") {
          return "/static/images/authorisation-" + authorisationLevel + "-dark.svg"
        } else {
          return "/static/images/authorisation-" + props.level + "-dark.svg"
        }
    }
  }

  const onDecrease = () => {
    if (authorisationLevel > 0) {
      setAuthorisationLevel(authorisationLevel => authorisationLevel - 1)
    }
  }

  const onIncrease = () => {
    if (authorisationLevel < 9) {
      setAuthorisationLevel(authorisationLevel => authorisationLevel + 1)
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
            onClick={onDecrease}
            disabled={authorisationLevel === 0}
          />
          {authorisationLevel === 0 ? <NoEncryptionIcon fontSize="large"/> : <img
            id={props.markerId}
            className={classes.image}
            src={getImageSource()}
          />}
          <Button
            type="icon"
            icon="ArrowRight"
            onClick={onIncrease}
            disabled={authorisationLevel === 9}
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