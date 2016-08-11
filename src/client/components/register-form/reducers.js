import {REGISTER_ERROR, REGISTER_SUBMIT} from './actions';


const defaultState = {
  disabled: false,
  errors: new Map(),
};


const registerForm = (state=defaultState, action) => {
  switch (action.type) {
    case REGISTER_ERROR:
      return Object.assign({}, {
        disabled: false,
        errors: action.errors,
      });

    case REGISTER_SUBMIT:
      return Object.assign({}, {
        disabled: true,
        errors: new Map(),
      });

    default:
      return state;
  }
};

export default registerForm;
