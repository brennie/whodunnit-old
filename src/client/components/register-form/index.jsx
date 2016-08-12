import {connect} from 'react-redux';

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
  onRegister: (name, email, password, confirmPassword) => dispatch(registerSubmit(name, email, password)),
  onValidateError: (errors) => dispatch(registerError(errors)),
  onFieldValueChanged: (fieldName, fieldValue) => dispatch(setRegisterFormValues({
    [fieldName]: fieldValue,
  })),
});

const RegisterFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);

export default RegisterFormContainer;
