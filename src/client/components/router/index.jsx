import React from 'react';
import {IndexRoute, Route, Router as ReactRouter, hashHistory} from 'react-router';

import App from '../app';
import LoginForm from '../login-form';
import RegisterForm from '../register-form';


export default class Router extends React.Component {
  render() {
    return (
      <ReactRouter history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={LoginForm} />
          <Route path="login" component={LoginForm} />
          <Route path="register" component={RegisterForm} />
        </Route>
      </ReactRouter>
    );
  }
}
