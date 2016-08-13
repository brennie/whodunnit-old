import {connect} from 'react-redux';

import {addMessage} from '../message-list/actions';
import {registerError, registerSubmit, setRegisterFormValues} from './actions';
import RegisterForm from './registerForm';


const mapStateToProps = state => {
  return {
    disabled: state.registerForm.disabled,
    errors: state.registerForm.errors,
    formValues: state.registerForm.formValues,
  };
};

const mapDispatchToProps = dispatch => ({
  onFieldValueChanged: (fieldName, fieldValue) => dispatch(setRegisterFormValues({
    [fieldName]: fieldValue,
  })),
  onRegister: (name, email, password, confirmPassword) => {
    dispatch(dismissMessage('form-error'));
    dispatch(registerSubmit(name, email, password));
  },
  onValidateError: (errors) => {
    dispatch(registerError(errors));
    dispatch(addMessage({
      id: 'register-form-error',
      text: 'Please correct the errors below:',
      type: 'error',
      userDismissable: false,
    }));
  },
});

const RegisterFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);

export default RegisterFormContainer;
