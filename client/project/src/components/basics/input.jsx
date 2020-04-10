import React, { useState } from "react";
import MaterialInput from "@material-ui/core/Input"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import IconButton from "@material-ui/core/IconButton"
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { CloudUpload, Delete, AttachFile, GetApp, MoreHoriz, Lock, AccountCircle, Visibility, VisibilityOff } from "@material-ui/icons"

export const returnIcon = (icon, size) => {
  switch (icon) {
    case "CloudUpload":
      return <CloudUpload fontSize={size}/>
    case "Delete":
      return <Delete fontSize={size}/>
    case "AttachFile":
      return <AttachFile fontSize={size}/>
    case "GetApp":
      return <GetApp fontSize={size}/>
    case "More":
      return <MoreHoriz fontSize={size}/>
    case "Lock":
      return <Lock fontSize={size}/>
    case "AccountCircle":
      return <AccountCircle fontSize={size}/>
  }
}

const Input = (props) => {
  const [inputValue, setInputValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const renderHideAndIconType = () => {
    if (props.variant === null){
      return (
        <MaterialInput
          id="outlined-adornment-password"
          variant={props.variant}
          type={showPassword ? 'text' : 'password'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              {returnIcon(props.icon, "small")}
            </InputAdornment>
          }
          labelWidth={70}
        />
      )
    } else if (props.variant === "outlined") {
      return (
        <OutlinedInput
          id="outlined-adornment-password"
          variant={props.variant}
          type={showPassword ? 'text' : 'password'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              {returnIcon(props.icon, "small")}
            </InputAdornment>
          }
          labelWidth={70}
        />
      )
    }
  }

  const renderHideType = () => {
    if (props.variant === null){
      return (
        <MaterialInput
          id="outlined-adornment-password"
          variant={props.variant}
          type={showPassword ? 'text' : 'password'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
      )
    } else if (props.variant === "outlined") {
      return (
        <OutlinedInput
          id="outlined-adornment-password"
          variant={props.variant}
          type={showPassword ? 'text' : 'password'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
      )
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const type = {
    normal: {
      input: <TextField
          style={{
            width: "270px"
          }}
          value={inputValue}
          data-test="component-input"
          disabled={props.disabled} 
          label={props.label} 
          color={props.color} 
          variant={props.variant}
          onChange={(e) => setInputValue(e.target.value)}/>
    },
    normalWithIcon: {
      input: <TextField
      style={{
        width: "270px"
      }}
      data-test="component-input"
      label={props.label}
      color={props.color} 
      onChange={(e) => setInputValue(e.target.value)}
      value={inputValue}
      variant={props.variant}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {returnIcon(props.icon, "small")}
          </InputAdornment>
        ),
      }}/>
    },
    normalWithHide: {
      input: <FormControl 
      style={{
        width: "270px"
      }}
      variant={props.variant}
      color={props.color}
    >
      <InputLabel 
      data-test="component-input"
      htmlFor="outlined-adornment-password">{props.label}</InputLabel>
      {renderHideType()}
    </FormControl>
    },
    iconAndHide: {
      input: <FormControl 
        variant={props.variant}
        color={props.color}
      >
        <InputLabel 
        data-test="component-input"
        htmlFor="outlined-adornment-password">{props.label}</InputLabel>
        {renderHideAndIconType()}
      </FormControl>
    }
  }

  const style = type[props.type]

  return (
    <div>
      {style.input}
    </div>
  )

}

export default Input;