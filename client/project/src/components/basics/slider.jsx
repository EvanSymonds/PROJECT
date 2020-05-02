import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import MaterialSlider from '@material-ui/core/Slider';

const Slider = (props) => {

  const useStyles = makeStyles({
    root: {
      width: 300,
    },
  });
  const classes = useStyles()

  const returnMarks = () => {
    let marks = []
    for (let i=0; i<9; i++) {
      marks = [...marks, {
        value: i + 1,
        label: (i + 1).toString()
      }]
    }

    return marks
  }

  const onChangeCommitted = (event, value) => {
    console.log(value)
  }

  return (
    <div className={classes.root}>
      <MaterialSlider
        onChangeCommitted={onChangeCommitted}
        defaultValue={1}
        step={1}
        marks={returnMarks()}
        min={1}
        max={9}
      />
    </div>
  )
  
}

export default Slider