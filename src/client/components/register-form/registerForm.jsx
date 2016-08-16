import React from 'react';

import {Form, Field, ErrorList} from '../base/form';
import {validateUser} from 'lib/models/user';
import './style.css';


const emailRegex = /^.+@.+\..+$/;

export default class RegisterForm extends React.Component {
  static propTypes = {
    setFormErrors: React.PropTypes.func.isRequired,
    setFieldValue: React.PropTypes.func.isRequired,
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
                <Field name="name"
                       type="text"
                       placeholder="Name" />
                <ErrorList fieldName="name" className="joined-fields__row__errors" />
              </div>
              <div className="joined-fields__row">
                <Field name="email"
                       type="text"
                       placeholder="E-mail Address"
                       inputMode="email" />
                <ErrorList fieldName="email" className="joined-fields__row__errors" />
              </div>
              <div className="joined-fields__row">
                <Field name="password"
                       type="password"
                       placeholder="Password" />
                <ErrorList fieldName="password" className="joined-fields__row__errors" />
              </div>
              <div className="joined-fields__row">
                <Field name="confirmPassword"
                       type="password"
                       placeholder="Confirm Password" />
                <ErrorList fieldName="confirmPassword" className="joined-fields__row__errors" />
              </div>
          </fieldset>
          <input type="submit" value="Register" className={submitClassName} />
        </Form>
      </div>
    );
  }
};
