import React from 'react';


export default class Field extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
  };

  static contextTypes = {
    errors: React.PropTypes.instanceOf(Map),
    values: React.PropTypes.instanceOf(Map),
    setFieldValue: React.PropTypes.func,
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

    if (originalClassName !== undefined && originalClassName.length !== 0)
      classNames.add(originalClassName);

    if (errors !== undefined && errors.length !== 0)
      classNames.add('error');

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
