import React from 'react';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme } from "./themes"

import Main       from './components/pages/main';
import Login      from "./components/pages/login"
import Signup     from "./components/pages/signup"
import Home       from "./components/pages/home"

export default function configRoutes() {
  return (
    <Router>
      <div>
        <ThemeProvider theme={darkModeTheme}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <AuthenticatedRoute path="/home" component={Home} />
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  )
}

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