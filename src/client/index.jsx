import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';

import messageList from './components/message-list/reducers';
import registerForm from './components/register-form/reducers';
import Router from './components/router';
import './css/reset.css';
import './style.css';


const reducers = combineReducers({
  messageList,
  registerForm
});

const state = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(
    thunkMiddleware
  )
);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={state}>
      <Router />
    </Provider>,
    document.getElementById('container'));
});
