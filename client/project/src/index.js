import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import Main from './components/pages/main';
import Login from "./components/pages/login"
import Signup from "./components/pages/signup"
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Route path="/home" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </div>
  </Router>
)

ReactDOM.render(routing,document.getElementById('root'))

serviceWorker.unregister();