import {hashHistory as history} from 'react-router';

import {addMessage} from '../message-list/actions';


export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUBMITTED = 'REGISTER_SUBMITTED';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const SET_REGISTER_FORM_VALUES = 'SET_REGISTER_FORM_VALUES'

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
    const errors = new Map();

    for (const field of Object.keys(rsp.error.fields)) {
      errors.set(field, rsp.error.fields[field]);
    }
    dispatch(registerError(errors));
  } else {
    dispatch(registerSuccess());
    }));
  }
};
