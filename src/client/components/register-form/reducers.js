import {REGISTER_ERROR, REGISTER_SUCCESS, REGISTER_SUBMITTED, SET_REGISTER_FORM_VALUES} from './actions';


const defaultState = {
  disabled: false,
  errors: new Map(),
  formValues: new Map([
    ['name', ''],
    ['email', ''],
    ['password', ''],
    ['confirmPassword', ''],
  ]),
};

const registerForm = (state=defaultState, action) => {
  switch (action.type) {
    case REGISTER_ERROR:
      return Object.assign({}, state, {
        disabled: false,
        errors: action.errors,
      });

    case REGISTER_SUCCESS:
      return Object.assign({}, state, {
        disabled: false,
      });

    case REGISTER_SUBMITTED:
      return Object.assign({}, state, {
        disabled: true,
        errors: new Map(),
      });

    case SET_REGISTER_FORM_VALUES: {
      const newValues = new Map(state.formValues);

      for (const [field, value] of Object.entries(action.values)) {
        newValues.set(field, value);
      }

      return Object.assign({}, state, {
        formValues: newValues
      });
    }

    default:
      return state;
  }
};

export default registerForm;
