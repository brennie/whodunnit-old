import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {IndexRoute, Route, Router, hashHistory} from 'react-router';
import {routerMiddleware, routerReducer, syncHistoryWithStore} from 'react-router-redux';
import {applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import App from './components/app';
import Home from './components/home';
import LoginForm from './components/login-form';
import messageList from './components/message-list/reducers';
import RegisterForm from './components/register-form';
import registerForm from './components/register-form/reducers';
import createStore from './createStore';
import './css/reset.css';
import './style.css';


const reducer = combineReducers({
  messageList,
  registerForm,
  routing: routerReducer,
});

const store = createStore(
  reducer,
  {},
  applyMiddleware(
    thunkMiddleware,
    routerMiddleware(hashHistory)
  )
);
const history = syncHistoryWithStore(hashHistory, store);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="login" component={LoginForm} />
          <Route path="register" component={RegisterForm} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('container'));
});
