import React from 'react';
import ReactDOM from 'react-dom';
import configRoutes from "./router"
import * as serviceWorker from './serviceWorker';

const routing = (
  configRoutes()
)

ReactDOM.render(routing,document.getElementById('root'))

serviceWorker.unregister();