import React from 'react';

import {CHECK_AUTH_STATUS_NONE, CHECK_AUTH_STATUS_RECEIVED, CHECK_AUTH_STATUS_WAITING} from 'client/auth/constants';
import './style.css';

/**
 * An empty component that forwards to the login page.
 */
export default class Home extends React.Component {
  static propTypes = {
    checkAuthStatus: React.PropTypes.string.isRequired,
    replaceHistory: React.PropTypes.func.isRequired,
    startCheckAuthStatus: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
  };

  componentWillMount() {
    switch (this.props.checkAuthStatus) {
      case CHECK_AUTH_STATUS_NONE:
        this.props.startCheckAuthStatus();
        break;

      case CHECK_AUTH_STATUS_RECEIVED:
        if (!this.props.user)
          this.props.replaceHistory('/login');

        break;
    }
  }

  render() {
    if (this.props.checkAuthStatus === CHECK_AUTH_STATUS_RECEIVED) {
      if (!!this.props.user)
        return <h2>Welcome, {this.props.user.name}</h2>;

      return null;
    }

    return (
      <span className="fa fa-spin fa-spinner loading-icon"
            aria-hidden="true"
            title="Loading..." />
    );
  }
};
