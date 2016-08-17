import {push as pushHistory, replace as replaceHistory} from 'react-router-redux';
import {connect} from 'react-redux';

import {setCheckAuthStatus} from 'client/auth/actions';
import {CHECK_AUTH_STATUS_RECEIVED, CHECK_AUTH_STATUS_WAITING} from 'client/auth/constants';
import Home from './home';


const mapStateToProps = state => ({
  checkAuthStatus: state.auth.checkAuthStatus,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  pushHistory: location => dispatch(pushHistory(location)),
  replaceHistory: location => dispatch(replaceHistory(location)),
  startCheckAuthStatus: async () => {
    dispatch(setCheckAuthStatus(CHECK_AUTH_STATUS_WAITING));

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const rsp = await fetch('/api/session',
      {
        credentials: 'same-origin',
        headers,
        method: 'get',
      })
      .then(rsp => rsp.json());

    if (rsp.session && rsp.session.user)
      dispatch(setCheckAuthStatus(CHECK_AUTH_STATUS_RECEIVED, rsp.session.user));
    else {
      dispatch(setCheckAuthStatus(CHECK_AUTH_STATUS_RECEIVED));
      dispatch(replaceHistory('/login'));
    }
  },
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeContainer;
