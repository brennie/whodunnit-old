import {connect} from 'react-redux';
import {push as pushHistory} from 'react-router-redux';

import {loggedOut} from 'client/auth/actions';
import {addMessage} from 'client/components/ui/message-list/actions';
import {MessageTypes} from 'client/components/ui/message-list';
import NavBar from './navBar';


const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  logout: async () => {
    const rsp = await fetch('/api/session', {
      'credentials': 'same-origin',
      'method': 'delete',
    });

    if (rsp.status === 204) {
      dispatch(addMessage({
        text: 'You have logged out.',
        type: MessageTypes.success,
        timeout: 5 * 1000,
      }));
      dispatch(loggedOut());
      dispatch(pushHistory('/login'));
    }
    else {
      const rspJson = rsp.json();
      dispatch(addMessage({
        text: rspJson && rspJson.error && rspJson.error.message || 'An unexpected error occurred.',
        type: MessageTypes.error,
        timeout: 5 * 1000,
      }));
    }
  },
});

const NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(NavBar);
export default NavBarContainer;
