import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import messageList from './components/message-list/reducers';
import registerForm from './components/register-form/reducers';
import Router from './components/router';
import createStore from './createStore';
import './css/reset.css';
import './style.css';


const reducer = combineReducers({
  messageList,
  registerForm
});

const state = createStore(reducer, {}, applyMiddleware(thunkMiddleware));

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={state}>
      <Router />
    </Provider>,
    document.getElementById('container'));
});
