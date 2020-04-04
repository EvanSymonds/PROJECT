import React from "react";
import FileUpload from "../complex/fileUpload"
import FileSystem from "../complex/fileSystem"
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"

const Main = (props) => {

  let theme = createMuiTheme({
    palette: {
      primary: {
        main: red[600],
        contrastText: '#fff',
      },
      secondary: {
        main: grey[500],
        light: grey[300]
      },
    },
    typography:{
      button: {
        fontWeight: "500",
        textTransform: 'none',
      }
    }
  })
  theme = responsiveFontSizes(theme);

  return(
    <ThemeProvider theme={theme}>
      <div>
        <FileSystem />
        <FileUpload />
      </div>
    </ThemeProvider>    
  )
}

export default Main;