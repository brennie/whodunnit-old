import React from 'react';


export default class ErrorList extends React.Component {
  static contextTypes = {
    errors: React.PropTypes.instanceOf(Map),
  };

  static propTypes = {
    fieldName: React.PropTypes.string,
  };

  render() {
    const {fieldName, ...restProps} = this.props;
    const entries = [];
    const errors = this.context.errors.get(fieldName);

    if (errors === undefined || errors.length === 0) {
      return null;
    }

    console.log(errors);

    for (const [i, errorText] of errors.entries()) {
      entries.push(<li key={i}>{errorText}</li>);
    }
    return (
      <ul {...restProps}>
        {entries}
      </ul>
    );
  }
};
