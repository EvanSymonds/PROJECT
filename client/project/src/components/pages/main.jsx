import React from "react";
import FileSystem from "../complex/fileSystem"
import Input from "../basics/input"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme } from "../../themes"

const Main = (props) => {

  return(
    <ThemeProvider theme={redGreyTheme}>
      <div data-test="component-main">
        <form>
          <Input type="normal" label="Username" variant="outlined" color="primary" />
          <Input type="normalWithHide" label="Password" variant="outlined" icon="Lock" color="primary"/>
        </form>
      </div>
    </ThemeProvider>    
  )
}

export default Main;