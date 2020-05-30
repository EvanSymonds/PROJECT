import React, {useEffect} from 'react';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';
import axios from "axios"

import { connect } from "react-redux"
import { selectTheme } from "./actions"

import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme } from "./themes"

import Main         from  "./components/pages/main"
import Login        from  "./components/pages/login"
import Signup       from  "./components/pages/signup"
import Projects     from  "./components/pages/projects"
import Settings     from  "./components/pages/settings"
import Support      from  "./components/pages/support"
import ProjectPage  from  "./components/pages/projectPage"

var jwt = require("jsonwebtoken")

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('authToken') ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const AppRouter = (props) => {

  useEffect( () => {

    if (window.localStorage.getItem("authToken") !== "undefined" && window.localStorage.getItem("authToken")){
      const encrypted = window.localStorage.getItem("authToken")
      const token = jwt.decode(JSON.parse(encrypted))

      const getSettings = async() => {
        await axios.get("http://localhost:3001/user_settings/" + token.user_id).then((settings) => {

          const getThemeId = () => {
            switch (settings.data.rows[0].theme){
              case "redGreyTheme":
                return 0
              case "darkModeTheme":
                return 1
              case "orangeBlackTheme":
                return 2
            }
          }

          const theme = {
            name: settings.data.rows[0].theme,
            id: getThemeId()
          }


          props.selectTheme(theme)
        })
        .catch((error) => {
          console.log(error)
        })
      }
      getSettings()
    }
  }, [])

  const returnTheme = () => {
    switch (props.selectedTheme.name) {
      case "redGreyTheme":
        return redGreyTheme
      case "darkModeTheme":
        return darkModeTheme
    }
  }

  return (
    <Router>
      <div>
        <ThemeProvider theme={returnTheme()}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/settings" component={Settings} />
            <Route path="/support" component={Support} />
            <AuthenticatedRoute path="/projects" component={Projects} />
            <AuthenticatedRoute path="/:project_name/:project_id" component={ProjectPage} />
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  )
}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps, { selectTheme })(AppRouter)