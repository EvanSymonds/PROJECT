import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';
import Main from './components/pages/main';
import Login from "./components/pages/login"
import Signup from "./components/pages/signup"
import { ThemeProvider } from "@material-ui/core/styles"
import { redGreyTheme, darkModeTheme } from "./themes"
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <ThemeProvider theme={darkModeTheme}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </ThemeProvider>
    </div>
  </Router>
)

ReactDOM.render(routing,document.getElementById('root'))

serviceWorker.unregister();