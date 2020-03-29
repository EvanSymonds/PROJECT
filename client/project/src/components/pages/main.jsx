import React from "react";
import Dropzone from "../basics/dropzone"
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"

const Main = (props) => {

  let theme = createMuiTheme({
    palette: {
      primary: {
        main: red[600],
      },
      secondary: {
        main: grey[300],
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    },
    typography:{
      button: {
        fontWeight: "500",
        textTransform: 'none'
      }
    }
  })
  theme = responsiveFontSizes(theme);

  return(
    <ThemeProvider theme={theme}>
      <div>
        <Dropzone />
      </div>
    </ThemeProvider>    
  )
}

export default Main;