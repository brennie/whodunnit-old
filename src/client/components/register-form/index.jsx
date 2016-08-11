import {connect} from 'react-redux';

import {registerError, registerSubmit} from './actions';
import RegisterForm from './registerForm';


const mapStateToProps = state => {
  return {
    errors: state.registerForm.errors,
    disabled: state.registerForm.disabled,
  };
};

const mapDispatchToProps = dispatch => ({
  onRegister: (name, email, password, confirmPassword) => dispatch(registerSubmit(name, email, password)),
  onValidateError: (errors) => dispatch(registerError(errors)),
});

const RegisterFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);

export default RegisterFormContainer;
