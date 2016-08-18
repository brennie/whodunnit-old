import React from 'react';

import {withoutProperties} from 'lib/functional';


export default class Form extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    errors: React.PropTypes.instanceOf(Map).isRequired,
    name: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    setFieldValue: React.PropTypes.func.isRequired,
    values: React.PropTypes.instanceOf(Map).isRequired,
  };

  static childContextTypes = {
    errors: React.PropTypes.instanceOf(Map),
    setFieldValue: React.PropTypes.func,
    values: React.PropTypes.instanceOf(Map),
  };

  render() {
    const {children, name, ...restProps} = this.props;
    const childProps = withoutProperties(restProps, 'errors', 'setFieldValue');

    return (
      <form name={name} {...childProps}>
        {children}
      </form>
    );
  }

  getChildContext() {
    const {errors, setFieldValue, values} = this.props;
    return {errors, setFieldValue, values};
  }
}
