import React from "react";
import FileSystem from "../complex/fileSystem"
import Login from "../complex/login"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"

const Main = (props) => {

  return(
    <ThemeProvider theme={redGreyTheme}>
      <div data-test="component-main">
        <Login />
      </div>
    </ThemeProvider>    
  )
}

export default Main;