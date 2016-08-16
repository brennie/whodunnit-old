import {LOGGED_IN, LOGGED_OUT} from './actions';


const defaultState = {
  authenticated: false,
  user: null,
};

const auth = (state=defaultState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return Object.assign({}, state, {
        authenticated: true,
        user: action.user,
      });

    case LOGGED_OUT:
      return Object.assign({}, state, {
        authenticated: false,
        user: null,
      });

    default:
      return state;
  }
};

export default auth;
