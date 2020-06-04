import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from "@material-ui/core/ButtonBase"
import Card from "@material-ui/core/Card"
import { Add, Remove } from "@material-ui/icons"

const ValueSelect = (props) => {

  const useStyles = makeStyles((theme) => ({
    leftButton: {
      width: 30,
      height: 30,
      backgroundColor: theme.palette.primary.main,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
    center: {
      width: 30,
      height: 28,
      backgroundColor: theme.palette.background.default,
      borderStyle: "solid",
      borderWidth: "1px 0px 1px 0px",
      borderColor: theme.palette.primary.main,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    rightButton: {
      width: 30,
      height: 30,
      backgroundColor: theme.palette.primary.main,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    icon: {
      color: theme.palette.background.default
    }
  }));
  const classes = useStyles();

  const onIncrease = () => {
    if (props.value < props.maxValue) {
      props.onChange(props.value + 1)
    }
  }

  const onDecrease = () => {
    if (props.value > props.minValue){
      props.onChange(props.value - 1)
    }
  }

  return (

    <form style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <ButtonBase
        className={classes.leftButton}
        onClick={onDecrease}
        disabled={props.disabled}
      >
        <Remove className={classes.icon}/>
      </ButtonBase>
      <Card
        square
        elevation={0}
        className={classes.center}
      >
        <div style={{ marginBottom: 1 }}>
          {props.value}
        </div>
      </Card>
      <ButtonBase
        className={classes.rightButton}
        onClick={onIncrease}
        disabled={props.disabled}
      >
        <Add className={classes.icon}/>
      </ButtonBase>
    </form>

  )

}

export default ValueSelect