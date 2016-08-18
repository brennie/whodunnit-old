import {connect} from 'react-redux';
import {push as pushHistory} from 'react-router-redux';

import {addMessage, dismissMessage} from 'client/components/ui/message-list/actions';
import {MessageTypes} from 'client/components/ui/message-list';
import {enableRegisterForm, setRegisterFormErrors, updateRegisterFormValues} from './actions';
import RegisterForm from './registerForm';


const mapStateToProps = state => ({
  disabled: state.registerForm.disabled,
  errors: state.registerForm.errors,
  values: state.registerForm.values,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  setFormErrors: errors => {
    dispatch(setRegisterFormErrors(errors));
    dispatch(addMessage({
      appliesTo: '/register',
      id: 'register-form-error',
      text: 'Please correct the errors below:',
      type: MessageTypes.error,
      userDismissable: false,
    }));
  },
  setFieldValue: (fieldName, value) => dispatch(updateRegisterFormValues({
    [fieldName]: value,
  })),
  submit: async (name, email, password) => {
    dispatch(dismissMessage('register-form-error'));
    dispatch(enableRegisterForm(false));

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');

    const rsp = await fetch('/api/user',
      {
        body: JSON.stringify({name, email, password}),
        credentials: 'same-origin',
        headers,
        method: 'post',
      })
      .then(rsp => rsp.json());

    if (rsp.hasOwnProperty('error')) {
      dispatch(enableRegisterForm(true));

      if (rsp.error.hasOwnProperty('fields')) {
        const errors = new Map(Object.entries(rsp.error.fields));

        dispatch(setRegisterFormErrors(errors));
        dispatch(addMessage({
          appliesTo: '/register',
          id: 'register-form-error',
          text: 'Please correct the errors below:',
          type: MessageTypes.error,
          userDismissable: false,
        }));
      } else {
        dispatch(setRegisterFormErrors(new Map()));
        dispatch(addMessage({
          appliesTo: '/register',
          text: rsp.error.message || 'An unexpected error occurred.',
          id: 'register-form-error',
          type: MessageTypes.error,
          userDismissable: false,
        }));
      }
    } else {
      dispatch(pushHistory('/login'));
      dispatch(addMessage({
        text: 'You have successfully registered.',
        type: MessageTypes.success,
        timeout: 5 * 1000,
      }));
      dispatch(enableRegisterForm(true));
      dispatch(updateRegisterFormValues({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }));
    }
  },
});

const RegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
export default RegisterFormContainer;
