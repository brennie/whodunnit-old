import React from 'react';

import {ErrorList, Field, Form, Label} from 'client/components/base/form';
import {validateEmail} from 'lib/models/user';
import './style.css';


export default class LoginForm extends React.Component {
  static propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Map).isRequired,
    setFormErrors: React.PropTypes.func.isRequired,
    setFieldValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    values: React.PropTypes.instanceOf(Map).isRequired,
  };

  onSubmit(e) {
    e.preventDefault();

    const {disabled, setFormErrors, submit, values} = this.props;

    if (this.props.disabled) {
      return;
    }

    const email = values.get('email');
    const password = values.get('password');
    const errors = new Map();

    const emailErrors = validateEmail(email);
    if (emailErrors.length)
      errors.set('email', emailErrors);

    if (password === undefined || password.length === 0)
      errors.set('password', ['This field is required.']);

    if (errors.size) {
      setFormErrors(errors)
    } else {
      submit(email, password);
    }
  }

  render() {
    const {disabled, values, errors, setFieldValue} = this.props;
    const submitClassName = disabled ? 'button--disabled' : 'button--primary'

    return (
      <div className="login-form">
        <h2>Log In</h2>
        <Form name="login"
              onSubmit={e => this.onSubmit(e)}
              values={values}
              errors={errors}
              setFieldValue={setFieldValue}>
          <fieldset className="joined-fields">
            <div className="joined-fields__row">
              <Label htmlFor="login-form-email-field"
                     text="E-mail Address"
                     fieldName="email">
                <Field name="email"
                       type="text"
                       inputMode="email"
                       id="login-form-email-field" />
              </Label>
              <ErrorList fieldName="email" className="joined-fields__row__errors" />
            </div>
            <div className="joined-fields__row">
              <Label htmlFor="login-form-password-field"
                     text="Password"
                     fieldName="password">
                <Field name="password"
                       type="password"
                       id="login-form-password-field" />
              </Label>
              <ErrorList fieldName="password" className="joined-fields__row__errors" />
            </div>
          </fieldset>
          <input type="submit" value="Log In" className={submitClassName} />
        </Form>
      </div>
    );
  }
};
