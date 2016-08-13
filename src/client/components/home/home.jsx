import React from 'react';


/**
 * An empty component that forwards to the login page.
 */
export default class Home extends React.Component {
  componentWillMount() {
    this.props.replaceHistory('/login');
  }

  render() {}
}
