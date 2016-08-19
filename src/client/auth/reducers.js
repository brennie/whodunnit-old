import {LOGGED_IN, LOGGED_OUT, SET_CHECK_AUTH_STATUS} from './actions';
import {CHECK_AUTH_STATUS_RECEIVED, CHECK_AUTH_STATUS_NONE} from './constants';


const defaultState = {
  checkAuthStatus: CHECK_AUTH_STATUS_NONE,
  user: null,
};

const auth = (state=defaultState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        user: action.user,
      };

    case LOGGED_OUT:
      return {
        ...state,
        user: null,
      };

    case SET_CHECK_AUTH_STATUS: {
      const newState = {
        ...state,
        checkAuthStatus: action.status,
      };

      if (action.status === CHECK_AUTH_STATUS_RECEIVED && !!action.user)
        newState.user = action.user;

      return newState;
    }

    default:
      return state;
  }
};

export default auth;
