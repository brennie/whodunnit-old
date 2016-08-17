import {CHECK_AUTH_STATUS_RECEIVED} from './constants';


export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const SET_CHECK_AUTH_STATUS = 'SET_AUTH_STATUS';

export const loggedIn = user => ({
  type: LOGGED_IN,
  user,
});

export const loggedOut = () => ({
  type: LOGGED_OUT,
});

export const setCheckAuthStatus = (status, user=undefined) => {
  const action = {
    type: SET_CHECK_AUTH_STATUS,
    status,
  };

  if (status === CHECK_AUTH_STATUS_RECEIVED && !!user)
    action.user = user;
  else
    action.user = undefined;

  return action;
};
