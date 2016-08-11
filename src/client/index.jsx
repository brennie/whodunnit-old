import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';


import registerForm from './components/register-form/reducers';
import Router from './components/router';
import './css/reset.css';
import './style.css';


const reducers = combineReducers({
  registerForm
});

const state = createStore(reducers,  window.devToolsExtension && window.devToolsExtension());

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={state}>
      <Router />
    </Provider>,
    document.getElementById('container'));
});
