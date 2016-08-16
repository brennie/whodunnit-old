import React from 'react';

import {withoutProperties} from 'lib/functional';


export class Form extends React.Component {
  static propTypes = {
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
    const childProps = withoutProperties(restProps, 'errors', 'setFieldValue')

    return (
      <form name={name} {...childProps}>
        {children}
      </form>
    )
  }

  getChildContext() {
    const {errors, setFieldValue, values} = this.props;
    return {errors, setFieldValue, values};
  }
};

export class Field extends React.Component {
  static contextTypes = {
    errors: React.PropTypes.instanceOf(Map),
    values: React.PropTypes.instanceOf(Map),
    setFieldValue: React.PropTypes.func,
  };

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
  };

  onChange() {
    if (this.props.type === 'checkbox')
      this.context.setFieldValue(this.props.name, this._el.checked);
    else
      this.context.setFieldValue(this.props.name, this._el.value);
  }

  render() {
    const {type, name, className: originalClassName, ...restProps} = this.props;
    const errors = this.context.errors.get(name);
    const classNames = new Set();

    if (originalClassName !== undefined && originalClassName.length !== 0) {
      classNames.add(originalClassName);
    }

    if (errors !== undefined && errors.length !== 0) {
      classNames.add('error');
    }

    const className = [...classNames].join(' ');

    switch (type) {
      case 'textarea':
        return (
          <textarea name={name}
                    ref={c => this._el = c}
                    onChange={() => this.onChange()}
                    className={className}
                    {...restProps}>
            {this.context.values.get(name)}
          </textarea>
        );

      case 'checkbox':
        return (
          <input type={type}
                 name={name}
                 ref={c => this._el = c}
                 checked={this.context.values.get(name) || false}
                 className={className}
                 {...restProps} />
        );

      default:
        return (
          <input type={type}
                 name={name}
                 ref={c => this._el = c}
                 onChange={() => this.onChange()}
                 value={this.context.values.get(name) || ''}
                 className={className}
                 {...restProps} />
       );
    }
  }
}

export class ErrorList extends React.Component {
  static contextTypes = {
    errors: React.PropTypes.instanceOf(Map),
  };

  static propTypes = {
    fieldName: React.PropTypes.string,
  };

  render() {
    const {fieldName, ...rest} = this.props;
    const entries = [];
    const errors = this.context.errors.get(fieldName);

    if (errors === undefined || errors.length === 0) {
      return null;
    }

    for (const [i, errorText] of errors.entries()) {
      entries.push(<li key={i}>{errorText}</li>);
    }
    return (
      <ul {...rest}>
        {entries}
      </ul>
    );
  }
};
