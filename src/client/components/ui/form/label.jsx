import React from 'react';


export default class Label extends React.Component {
  static propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    htmlFor: React.PropTypes.string.isRequired,
  };

  static contextTypes = {
    values: React.PropTypes.instanceOf(Map),
  };

  render() {
    const classNames = ['floating-label'];

    if (this.context.values.get(this.props.fieldName))
      classNames.push('floating-label--floating');

    return (
      <div className={classNames.join(' ')}>
        {this.props.children}
        <label htmlFor={this.props.htmlFor}>{this.props.text}</label>
      </div>
    );
  }
};
