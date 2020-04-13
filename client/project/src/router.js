import React from 'react';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';

import { connect } from "react-redux"
import { selectTheme } from "./actions"

import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme, orangeBlackTheme } from "./themes"

import Main       from  "./components/pages/main"
import Login      from  "./components/pages/login"
import Signup     from  "./components/pages/signup"
import Projects   from  "./components/pages/projects"
import Settings   from  "./components/pages/settings"
import Support    from  "./components/pages/support"

const AppRouter = (props) => {

  const returnTheme = () => {
    switch (props.selectedTheme.name) {
      case "redGreyTheme":
        return redGreyTheme
      case "darkModeTheme":
        return darkModeTheme
      case "orangeBlackTheme":
        return orangeBlackTheme
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
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  )
}

const mapStateToProps = state => {
  return { selectedTheme: state.selectedTheme }
}

export default connect(mapStateToProps)(AppRouter)

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