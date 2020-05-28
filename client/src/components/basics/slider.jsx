import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import MaterialSlider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography"

const Slider = (props) => {
  const [value, setValue] = useState(props.default)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 300,
    },
    slider: {
      marginLeft: 10,
      '&.Mui-disabled': {
        color: theme.palette.primary.main
      }
    },
    text: {
      marginLeft: 6,
      fontSize: 16,
    }
  }));
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
    props.onChange(props.setting, value)
  }

  const onChange = (event, value) => {
    setValue(value)
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.text}>
        {props.title}
      </Typography>
      <MaterialSlider
        className={classes.slider}
        onChangeCommitted={onChangeCommitted}
        onChange={onChange}
        value={value}
        step={1}
        marks={returnMarks()}
        min={1}
        max={9}
        disabled={props.disabled}
      />
    </div>
  )
  
}

export default Slider