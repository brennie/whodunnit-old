import React from 'react';

import {validateUser} from 'lib/models/user';
import './style.css';


const emailRegex = /^.+@.+\..+$/;


export default class RegisterForm extends React.Component {
  constructor() {
    super();

    this._fields = new Map();
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

    const name = this._fields.get('name').value;
    const email = this._fields.get('email').value;
    const password = this._fields.get('password').value;
    const confirmPassword = this._fields.get('confirmPassword').value;

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

    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      const errs = Array.from((this.props.errors.get(field) || []).entries())
        .map(([i, err]) => <li key={`${field}-${i}`}>{err}</li>);

      if (errs.length) {
        fieldErrors[field] = <ul className="joined-fields__row__errors">{errs}</ul>;
      } else {
        fieldErrors[field] = null;
      }
    }

    return (
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={e => this.onSubmit(e)}>
          <fieldset className="joined-fields">
            <div className="joined-fields__row">
              <input type="text"
                     placeholder="Name"
                     value={this.props.formValues.get('name')}
                     ref={c => this._fields.set('name', c)}
                     onChange={() => this.handleFieldValueChanged('name')}
                     className={fieldErrors.name ? 'error': ''} />
              {fieldErrors.name}
            </div>
            <div className="joined-fields__row">
              <input type="text"
                     inputMode="email"
                     placeholder="E-mail Address"
                     value={this.props.formValues.get('email')}
                     ref={c => this._fields.set('email', c)}
                     onChange={() => this.handleFieldValueChanged('email')}
                     className={fieldErrors.email ? 'error' : ''} />
              {fieldErrors.email}
            </div>
            <div className="joined-fields__row">
              <input type="password"
                     placeholder="Password"
                     value={this.props.formValues.get('password')}
                     ref={c => this._fields.set('password', c)}
                     onChange={() => this.handleFieldValueChanged('password')}
                     className={fieldErrors.password ? 'error' : ''} />
              {fieldErrors.password}
            </div>
            <div className="joined-fields__row">
              <input type="password"
                     placeholder="Confirm Password"
                     value={this.props.formValues.get('confirmPassword')}
                     ref={c => this._fields.set('confirmPassword', c)}
                     onChange={() => this.handleFieldValueChanged('confirmPassword')}
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

  handleFieldValueChanged(fieldName) {
    this.props.onFieldValueChanged(fieldName, this._fields.get(fieldName).value);
  }
};

RegisterForm.defaultProps = {
  disabled: false,
  errors: new Map(),
  formValues: new Map([
    ['name', ''],
    ['email', ''],
    ['password', ''],
    ['confirmPassword', ''],
  ]),
};
