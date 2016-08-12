import {REGISTER_ERROR, REGISTER_OK, REGISTER_SUBMITTED} from './actions';


const defaultState = {
  disabled: false,
  errors: new Map(),
  user: {
    id: null,
    email: null,
    name: null,
  },
};


const registerForm = (state=defaultState, action) => {
  switch (action.type) {
    case REGISTER_ERROR:
      return Object.assign({}, {
        disabled: false,
        errors: action.errors,
      });

    case REGISTER_OK:
      return Object.assign({}, {
        user: action.user,
      });

    case REGISTER_SUBMITTED:
      return Object.assign({}, {
        disabled: true,
        errors: new Map(),
      });

    default:
      return state;
  }
};

export default registerForm;
