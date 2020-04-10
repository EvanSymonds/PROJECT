import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"
import blue from "@material-ui/core/colors/blue"


let redGreyTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: red[600],
      contrastText: '#fff',
    },
    secondary: {
      main: grey[500],
      light: grey[200]
    },
  },
  typography:{
    button: {
      fontWeight: "500",
      textTransform: 'none',
    }
  }
})

let darkModeTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary:{
      main: blue[300]
    },
    secondary:{
      main: grey[500],
      light: grey[700]
    }
  },
  typography:{
    button: {
      fontWeight: "500",
      textTransform: 'none',
    }
  }
})

darkModeTheme = responsiveFontSizes(darkModeTheme)
redGreyTheme  = responsiveFontSizes(redGreyTheme)
export { redGreyTheme, darkModeTheme }