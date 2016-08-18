import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {browserHistory, IndexRoute, Route, Router} from 'react-router';
import {routerMiddleware, routerReducer, syncHistoryWithStore} from 'react-router-redux';
import {applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from 'client/auth/reducers';
import App from 'client/components/app';
import Home from 'client/components/pages/home';
import LoginPage from 'client/components/pages/login';
import loginForm from 'client/components/pages/login/reducers';
import RegisterPage from 'client/components/pages/register';
import registerForm from 'client/components/pages/register/reducers';
import messageList from 'client/components/ui/message-list/reducers';
import createStore from './createStore';
import './css/reset.css';
import './style.css';


const reducer = combineReducers({
  auth,
  loginForm,
  messageList,
  registerForm,
  routing: routerReducer,
});

const store = createStore(
  reducer,
  {},
  applyMiddleware(
    thunkMiddleware,
    routerMiddleware(browserHistory)
  )
);

const history = syncHistoryWithStore(browserHistory, store);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="login" component={LoginPage} />
          <Route path="register" component={RegisterPage} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('container'));
});
