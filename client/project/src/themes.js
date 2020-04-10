import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"


let redGreyTheme = createMuiTheme({
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
redGreyTheme  = responsiveFontSizes(redGreyTheme)
export { redGreyTheme }