import React from "react"
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card"
import ClearIcon from '@material-ui/icons/Clear';

const ColorPicker = (props) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 170,
      height: 50,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.type === "light" ? theme.palette.background.default : theme.palette.secondary.light
    },
    cube: {
      width: 16,
      height: 16,
      margin: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      '&:hover': {
        width: 18,
        height: 18,
      }
    },
    clearCross: {
      color: "red",
      fontSize: 22
    }
  }))
  const classes = useStyles()

  const colors = ["red", "orange", "yellow", "LimeGreen", "green", "blue", "purple"]

  const onChangeColor = (event) => {
    props.colorChange(event.target.id)
  }

  const renderColorCubes = () => {
    let colorsArray = colors.map((color, i) => {
      return (
        <Card
          square
          onClick={onChangeColor}
          key={i}
          id={color}
          className={classes.cube}
          style={{ backgroundColor: color }}
        />
      )
    })

    colorsArray = [...colorsArray, (
      <Card
          square
          onClick={onChangeColor}
          key={colors.length + 1}
          id={null}
          className={classes.cube}
          style={{ backgroundColor: "white" }}
        >
          <ClearIcon className={classes.clearCross}/>
        </Card>
    )]

    return colorsArray
  }

  return (
    <Card
      id="toolbar-element"
      className={classes.root}
    >
      {renderColorCubes()}
    </Card>
  )

}

export default ColorPicker