import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import { red, green, blue, grey, lightBlue, orange } from "@material-ui/core/colors"


let redGreyTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: red[600],
      contrastText: '#fff',
    },
    secondary: {
      dark: grey[500],
      main: grey[400],
      light: grey[200]
    },
  },
  typography:{
    button: {
      fontWeight: "500",
      textTransform: 'none',
    }
  },
  spacing: 4
})

let darkModeTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary:{
      main: blue[300]
    },
    secondary:{
      dark: grey[300],
      main: grey[500],
      light: grey[700],
    }
  },
  typography:{
    button: {
      fontWeight: "500",
      textTransform: 'none',
    }
  },
  spacing: 4
})

let orangeBlackTheme = createMuiTheme({
  palette: {
    type: "light",
    primary:{
      main: orange[500]
    },
    secondary:{
      dark: grey[400],
      main: grey[600],
      light: grey[800],
    }
  },
  typography:{
    button: {
      fontWeight: "500",
      textTransform: 'none',
    }
  },
  spacing: 4
})

orangeBlackTheme = responsiveFontSizes(orangeBlackTheme)
darkModeTheme = responsiveFontSizes(darkModeTheme)
redGreyTheme  = responsiveFontSizes(redGreyTheme)
export { redGreyTheme, darkModeTheme, orangeBlackTheme}