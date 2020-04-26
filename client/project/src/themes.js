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
      light: grey[200],
      menuGradient: "linear-gradient(to right, #eeeeee 40%, #e0e0e0 70%)",
      contrastText: '#000'
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
      menuGradient: "linear-gradient(to right, #616161 40%, #545454 70%)",
      contrastText: '#fff'
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

darkModeTheme = responsiveFontSizes(darkModeTheme)
redGreyTheme  = responsiveFontSizes(redGreyTheme)
export { redGreyTheme, darkModeTheme }