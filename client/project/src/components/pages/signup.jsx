import React from "react";
import SignupForm from "../complex/signupForm"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme } from "../../themes"

const Login = (props) => {

  const onFormComplete = () => {

  }

  return(
    <ThemeProvider theme={darkModeTheme}>
      <div data-test="component-main">
        <SignupForm onSignup={onFormComplete()}/>
      </div>
    </ThemeProvider>    
  )
}

export default Login;