export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_OK = 'REGISTER_OK';
export const REGISTER_SUBMITTED = 'SUBMITTED';

export const registerError = errors => ({
  type: REGISTER_ERROR,
  errors,
});

export const registerOK = user => ({
  type: REGISTER_OK,
  user,
});

export const registerSubmitted = (name, email, password) => ({
  type: REGISTER_SUBMITTED,
  name,
  email,
  password
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
    dispatch(registerOK({
      id: rsp.user.id,
      email,
      name,
    }));
  }
};
