import React from "react";
import LoginForm from "../complex/loginForm"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme } from "../../themes"

const Login = (props) => {

  const onLogin = () => {

  }

  return(
    <ThemeProvider theme={darkModeTheme}>
      <div data-test="component-main">
        <LoginForm onLogin={onLogin()}/>
      </div>
    </ThemeProvider>    
  )
}

export default Login;