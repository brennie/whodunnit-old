import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {browserHistory, IndexRoute, Route, Router} from 'react-router';
import {routerMiddleware, routerReducer, syncHistoryWithStore} from 'react-router-redux';
import {applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth/reducers';
import App from './components/app';
import Home from './components/home';
import LoginForm from './components/login-form';
import messageList from './components/message-list/reducers';
import RegisterFormContainer from './components/register-form';
import registerForm from './components/register-form/reducers';
import createStore from './createStore';
import './css/reset.css';
import './style.css';


const reducer = combineReducers({
  auth,
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

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={LoginForm} />
        <Route path="register" component={RegisterFormContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('container')
));
