import reduceReducers from 'reduce-reducers';

import baseForm from 'client/components/base/form/reducers';
import {ENABLE_LOGIN_FORM} from './actions';

const defaultState = {
  disabled: false,
  errors: new Map(),
  values: new Map([
    ['email', ''],
    ['password', ''],
  ]),
};

const loginForm = reduceReducers(
  (state=defaultState, action) => {
    switch (action.type) {
      case ENABLE_LOGIN_FORM:
        return {...state, disabled: !action.enabled};

      default:
        return state;
    }
  },
  baseForm('login')
);

export default loginForm;
