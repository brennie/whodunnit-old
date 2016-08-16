import React from 'react';

import {ErrorList, Field, Form} from 'client/components/base/form';
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

    const {disabled, submit, values} = this.props;

    if (this.props.disabled) {
      return;
    }

    const email = values.get('email');
    const password = values.get('password');
    const rememberMe = values.get('rememberMe');

    submit(email, password, rememberMe);
  }

  render() {
    const {disabled, values, errors, setFieldValue} = this.props;
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
              <Field name="email"
                     type="text"
                     inputMode="email"
                     placeholder="E-mail Address" />
              <ErrorList fieldName="email" className="joined-fields__row__errors" />
            </div>
            <div className="joined-fields__row">
              <Field name="password"
                     type="password"
                     placeholder="Password" />
              <ErrorList fieldName="password" className="joined-fields__row__errors" />
            </div>
          </fieldset>
          <label>
            <Field name="rememberMe"
                   type="checkbox" />
            <span>Remember Me</span>
          </label>
          <input type="submit" value="Log In" className="button--primary" />
        </Form>
      </div>
    );
  }
};
