import React from 'react';
import {connect} from 'react-redux';
import {replace as replaceHistory} from 'react-router-redux';

import {withoutProperties} from 'lib/functional';


const getDisplayName = component =>
  component.displayName || component.name || 'Component';

/**
 * A higher-order component that is only rendered when not logged in.
 *
 * When logged in, it will redirect to the root URL.
 *
 * @param {React.Component|function} Wrapped The React component to wrap.
 *
 * @returns {React.Component} The wrapped component.
 */
const notLoggedIn = Wrapped => {
  const displayName = `NotLoggedIn(${getDisplayName(Wrapped)})`;

  class NotLoggedIn extends React.Component {
    static displayName = displayName;

    static propTypes = {
      replaceHistory: React.PropTypes.func.isRequired,
      user: React.PropTypes.object,
    };

    componentWillMount() {
      if (this.props.user)
        this.props.replaceHistory('/');
    }

    render() {
      if (this.props.user)
        return null;

      const childProps = withoutProperties(this.props, 'replaceHistory', 'user');
      return <Wrapped {...childProps} />;
    }
  }

  const mapStateToProps = state => ({
    user: state.auth.user,
  });

  const mapDispatchToProps = dispatch => ({
    replaceHistory: location => dispatch(replaceHistory(location)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NotLoggedIn);
};

export default notLoggedIn;
