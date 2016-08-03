import React from 'react';

import './style.css';


export default class RegisterForm extends React.Component {
  render() {
    return (
      <div className="register-form">
        <h2>Register</h2>
        <form>
          <fieldset className="joined-fields">
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="E-mail Address" />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="password-confirm" placeholder="Confirm Password" />
          </fieldset>
          <input type="submit" value="Register" className="button--primary" />
        </form>
      </div>
    );
  }
}
