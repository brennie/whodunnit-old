import {push as pushHistory} from 'react-router-redux';

import {addMessage} from '../message-list/actions';


export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUBMITTED = 'REGISTER_SUBMITTED';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const SET_REGISTER_FORM_VALUES = 'SET_REGISTER_FORM_VALUES';

export const registerError = errors => ({
  type: REGISTER_ERROR,
  errors,
});

export const registerSubmitted = (name, email, password) => ({
  type: REGISTER_SUBMITTED,
  name,
  email,
  password
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS,
});

export const setRegisterFormValues = (values) => ({
  type: SET_REGISTER_FORM_VALUES,
  values,
});

export const registerSubmit = (name, email, password) => async (dispatch) => {
  dispatch(registerSubmitted(name, email, password));

  const headers = new Headers();
  headers.append('Content-type', 'application/json');

  const rsp = await fetch(
    '/api/user', {
      headers,
      method: 'post',
      body: JSON.stringify({name, email, password}),
    })
    .then(rsp => rsp.json());

  if (rsp.hasOwnProperty('error')) {
    if (rsp.error.hasOwnProperty('fields')) {
      const errors = new Map(Object.entries(rsp.error.fields));

      dispatch(registerError(errors));
      dispatch(addMessage({
        text: 'Please correct the errors below:',
        type: 'error',
        uniqueID: 'form-error',
        userDismissable: false,
      }));
    }
    else {
      dispatch(registerError());
      dispatch(addMessage({
        text: rsp.error.message || 'An unexpected error occurred.',
        type: 'error',
        userDismissable: true,
      }));
    }
  } else {
    dispatch(addMessage({
      text: 'You have successfully registered',
      type: 'success',
      timeout: 5 * 1000,
    }));
    dispatch(registerSuccess());
    dispatch(setRegisterFormValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }));
    dispatch(pushHistory('/login'));
  }
};
