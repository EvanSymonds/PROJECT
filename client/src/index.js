import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from "./router"
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux"
import { createStore } from "redux"
import reducers from "./reducers"

const URLProvider = React.createContext("http://localhost:3000/")

const store = createStore(
  reducers, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
,document.getElementById('root'))

serviceWorker.unregister();