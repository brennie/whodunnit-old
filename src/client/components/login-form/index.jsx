import React from 'react';

import './style.css';


const LoginForm = () => (
  <div className="login-form">
    <h2>Log In</h2>
    <form>
      <fieldset className="joined-fields">
        <div className="joined-fields__row">
          <input type="email" name="email" placeholder="E-mail Address" />
        </div>
        <div className="joined-fields__row">
          <input type="password" name="password" placeholder="Password" />
        </div>
      </fieldset>
      <label><input type="checkbox" name="remember-me" /><span>Remember Me</span></label>
      <input type="submit" value="Log In" className="button--primary" />
    </form>
  </div>
);

export default LoginForm;
