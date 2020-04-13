import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from "./router"
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux"
import { createStore } from "redux"
import reducers from "./reducers/settings"

ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <AppRouter />
  </Provider>
  ,document.getElementById('root'))

serviceWorker.unregister();