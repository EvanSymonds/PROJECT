import React,{ useState } from "react"
import { connect } from "react-redux"
import { selectTheme } from "../../actions/"
import Radio from "@material-ui/core/Radio"
import Paper from "@material-ui/core/paper"
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios"

var jwt = require("jsonwebtoken")

const ThemeChooser = (props) => {

  const themes = [
    {
      url: "/static/images/red-grey-icon.png",
      name: "redGreyTheme"
    },
    {
      url: "/static/images/dark-mode-icon.png",
      name: "darkModeTheme"
    },
    {
      url: "/static/images/orange-black-icon.png",
      name: "orangeBlackTheme"
    }
  ]

  const getRadioSelected = () => {
    return props.selectedTheme.id.toString()
  }

  const handleChange = (event) => {
    let theme = {
      name: event.target.name,
      id: event.target.id
    }

    props.selectTheme(theme)

    if (window.localStorage.getItem("authToken") !== "undefined" && window.localStorage.getItem("authToken")){
      const encrypted = window.localStorage.getItem("authToken")
      const token = jwt.decode(JSON.parse(encrypted))

      axios.post("http://localhost:3001/user_settings/" + token.user_id, { theme: theme.name }).then((error) => {
        if (error) {
          console.log(error)
        }
      })
    }
  }

  const renderRadios = () => {
    const radios = themes.map((theme, i) => {
      return (
        <div key={i.toString()} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 100,
          margin: 10,
        }}>
          <Paper 
            elevation={5} 
            square style={{
              width: 100,
              height: 68,
          }}>
            <img 
              src={theme.url}
              id={i.toString()}
              name={theme.name}
              onClick={handleChange}
            />
          </Paper>
          <Radio 
            checked={getRadioSelected() === i.toString()}
            id={i.toString()}
            onChange={handleChange}
            name={theme.name}
          />
        </div>
      )
    })
    return radios
  }

  return (

    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",

    }}>
      {renderRadios()}
    </div>

  )

}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps, { selectTheme })(ThemeChooser)