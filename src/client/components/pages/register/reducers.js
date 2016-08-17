import reduceReducers from 'reduce-reducers';

import baseForm from 'client/components/ui/form/reducers';
import {ENABLE_REGISTER_FORM} from './actions';


const defaultState = {
  disabled: false,
  errors: new Map(),
  values: new Map([
    ['name', ''],
    ['email', ''],
    ['password', ''],
    ['confirmPassword', ''],
  ]),
};

const registerForm = reduceReducers(
  (state=defaultState, action) => {
    switch (action.type) {
      case ENABLE_REGISTER_FORM:
        return {...state, disabled: !action.enabled};

      default:
        return state;
    }
  },
  baseForm('register')
);

export default registerForm;
