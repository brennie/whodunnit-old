import React from 'react';

import {ErrorList, Field, Form, Label} from 'client/components/base/form';
import {validateUser} from 'lib/models/user';
import './style.css';


export default class RegisterForm extends React.Component {
  static propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Map).isRequired,
    setFormErrors: React.PropTypes.func.isRequired,
    setFieldValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    values: React.PropTypes.instanceOf(Map).isRequired
  };

  validate(name, email, password, confirmPassword) {
    const errors = validateUser({name, email, password});

    if (password !== confirmPassword) {
      errors.set('confirmPassword', ['The passwords do not match.'])
    }

    return errors;
  }

  onSubmit(e) {
    e.preventDefault();

    const {disabled, setFormErrors, submit, values} = this.props;

    if (this.props.disabled) {
      return;
    }

    const name = values.get('name');
    const email = values.get('email');
    const password = values.get('password');
    const confirmPassword = values.get('confirmPassword');
    const errors = this.validate(name, email, password, confirmPassword);

    if (errors.size) {
      setFormErrors(errors);
    } else {
      submit(name, email, password);
    }
  }

  render() {
    const {disabled, values, errors, setFieldValue} = this.props;
    const submitClassName = disabled ? 'button--disabled' : 'button--primary';

    return (
      <div className="register-form">
        <h2>Register</h2>
        <Form name="register"
              onSubmit={e => this.onSubmit(e)}
              values={values}
              errors={errors}
              setFieldValue={setFieldValue}>
          <fieldset className="joined-fields">
            <div className="joined-fields__row">
              <Label htmlFor="register-form-name-field"
                     text="Name"
                     fieldName="name">
                <Field name="name"
                       type="text"
                       id="register-form-name-field" />
              </Label>
              <ErrorList fieldName="name" className="joined-fields__row__errors" />
            </div>
            <div className="joined-fields__row">
              <Label htmlFor="register-form-email-field"
                     text="E-mail Address"
                     fieldName="email">
                <Field name="email"
                       type="text"
                       inputMode="email"
                       id="register-form-email-field" />
              </Label>
              <ErrorList fieldName="email" className="joined-fields__row__errors" />
            </div>
            <div className="joined-fields__row">
              <Label htmlFor="register-form-password-field"
                     text="Password"
                     fieldName="password">
                <Field name="password"
                       type="password"
                       id="register-form-password-field" />
              </Label>
              <ErrorList fieldName="password" className="joined-fields__row__errors" />
            </div>
            <div className="joined-fields__row">
              <Label htmlFor="register-form-confirmPassword-field"
                     text="Confirm Password"
                     fieldName="confirmPassword">
                <Field name="confirmPassword"
                       type="password"
                       id="register-form-confirmPassword-field "/>
              </Label>
              <ErrorList fieldName="confirmPassword" className="joined-fields__row__errors" />
            </div>
          </fieldset>
          <input type="submit" value="Register" className={submitClassName} />
        </Form>
      </div>
    );
  }
};
