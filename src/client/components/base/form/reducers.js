import {SET_FORM_ERRORS, UPDATE_FORM_VALUES} from './actions';


const baseForm = formName => (state, action) => {
  switch (action.type) {
    case SET_FORM_ERRORS(formName):
      return {
        ...state,
        errors: action.errors,
      };

    case UPDATE_FORM_VALUES(formName):
      return {
        ...state,
        values: new Map([
          ...state.values.entries(),
          ...Object.entries(action.values),
        ]),
      };

    default:
      return state;
  }
};

export default baseForm;
