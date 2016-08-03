import React from 'react';

import './style.css';


export default class Login extends React.Component {
  render() {
    return (
      <div className="login-form">
        <h2>Log In</h2>
        <form>
          <input type="email" name="email" placeholder="E-mail Address" />
          <input type="password" name="password" placeholder="Password" />
          <label><input type="checkbox" name="remember-me" /><span>Remember Me</span></label>
          <input type="submit" value="Log In" className="button--primary" />
        </form>
      </div>
    );
  }
}
