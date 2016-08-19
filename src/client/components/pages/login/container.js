import {connect} from 'react-redux';
import {push as pushHistory} from 'react-router-redux';

import {loggedIn} from 'client/auth/actions';
import {addMessage, dismissMessage} from 'client/components/ui/message-list/actions';
import {MessageTypes} from 'client/components/ui/message-list';
import {enableLoginForm, setLoginFormErrors, updateLoginFormValues} from './actions';
import LoginForm from './loginForm';


const mapStateToProps = state => ({
  disabled: state.loginForm.disabled,
  errors: state.loginForm.errors,
  values: state.loginForm.values,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  setFormErrors: errors => {
    dispatch(setLoginFormErrors(errors));
    dispatch(addMessage({
      appliesTo: '/login',
      id: 'login-form-error',
      text: 'Please correct the errors below:',
      type: MessageTypes.error,
      userDismissable: false,
    }));
  },
  setFieldValue: (fieldName, value) => dispatch(updateLoginFormValues({
    [fieldName]: value,
  })),
  submit: async (email, password) => {
    dispatch(dismissMessage('login-form-error'));
    dispatch(enableLoginForm(false));

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');

    const rsp = await fetch('/api/session',
      {
        body: JSON.stringify({email, password}),
        credentials: 'same-origin',
        headers,
        method: 'post',
      })
      .then(rsp => rsp.json());

    if (rsp.hasOwnProperty('error')) {
      dispatch(enableLoginForm(true));

      if (rsp.error.hasOwnProperty('fields')) {
        const errors = new Map(Object.entries(rsp.error.fields));

        dispatch(setLoginFormErrors(errors));
        dispatch(addMessage({
          appliesTo: '/login',
          id: 'login-form-error',
          text: 'Please correct the errors below:',
          type: MessageTypes.error,
          userDismissable: false,
        }));
      } else {
        dispatch(setLoginFormErrors(new Map()));
        dispatch(addMessage({
          appliesTo: '/login',
          text: rsp.error.message || 'An unexpected error occurred.',
          id: 'login-form-error',
          type: MessageTypes.error,
          userDismissable: false,
        }));
      }
    } else {
      dispatch(pushHistory('/'));
      dispatch(addMessage({
        text: 'You have successfully logged in.',
        type: MessageTypes.success,
        timeout: 5 * 1000,
      }));
      dispatch(enableLoginForm(true));
      dispatch(updateLoginFormValues({
        email: '',
        password: '',
      }));
      dispatch(loggedIn(rsp.session.user));
    }
  },
});


const LoginFormContainer = connect(mapStateToProps, mapDispatchToProps)(LoginForm);
export default LoginFormContainer;
