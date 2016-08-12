import React from 'react';

import {validateUser} from 'lib/models/user';
import './style.css';


const emailRegex = /^.+@.+\..+$/;


export default class RegisterForm extends React.Component {
  constructor() {
    super();
  }

  validate(name, email, password, confirmPassword) {
    const errors = new validateUser({name, email, password});

    if (password !== confirmPassword) {
      errors.set('confirmPassword', ['The passwords do not match.']);
    }

    return errors;
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.props.disabled) {
      return;
    }

    const name = this._name.value;
    const email = this._email.value;
    const password = this._password.value;
    const confirmPassword = this._confirmPassword.value;

    const errors = this.validate(name, email, password, confirmPassword);

    if (errors.size) {
      this.props.onValidateError(errors);
    } else {
      this.props.onRegister(name, email, password);
    }
  }

  render() {
    const submitClassName = this.props.disabled ? 'button--disabled' : 'button--primary';

    const fieldErrors = {};
    let formHasErrors = false;

    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      const errs = Array.from((this.props.errors.get(field) || []).entries())
        .map(([i, err]) => <li key={`${field}-${i}`}>{err}</li>);

      if (errs.length) {
        formHasErrors = true;
        fieldErrors[field] = <ul className="joined-fields__row__errors">{errs}</ul>;
      } else {
        fieldErrors[field] = null;
      }
    }

    const errorText = formHasErrors ? <p className="errors">Please correct the errors below:</p> : null;

    return (
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={e => this.onSubmit(e)}>
          {errorText}
          <fieldset className="joined-fields">
            <div className="joined-fields__row">
              <input type="text"
                     placeholder="Name"
                     ref={c => this._name = c}
                     className={fieldErrors.name ? 'error': ''} />
              {fieldErrors.name}
            </div>
            <div className="joined-fields__row">
              <input type="text"
                     inputMode="email"
                     placeholder="E-mail Address"
                     ref={c => this._email = c}
                     className={fieldErrors.email ? 'error' : ''} />
              {fieldErrors.email}
            </div>
            <div className="joined-fields__row">
              <input type="password"
                     placeholder="Password"
                     ref={c => this._password = c}
                     className={fieldErrors.password ? 'error' : ''} />
              {fieldErrors.password}
            </div>
            <div className="joined-fields__row">
              <input type="password"
                     placeholder="Confirm Password"
                     ref={c => this._confirmPassword = c}
                     className={fieldErrors.confirmPassword ? 'error' : ''}/>
              {fieldErrors.confirmPassword}
            </div>
          </fieldset>
          <input type="submit"
                 value="Register"
                 className={submitClassName}/>
        </form>
      </div>
    );
  }
};

RegisterForm.defaultProps = {
  disabled: false,
  errors: new Map(),
};
