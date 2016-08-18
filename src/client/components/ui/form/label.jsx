import React from 'react';


const Label = ({children, fieldName, htmlFor, text}, {values}) => {
  const classNames = ['floating-label'];

  if (values.get(fieldName))
    classNames.push('floating-label--floating');

  return (
    <div className={classNames.join(' ')}>
      {children}
      <label htmlFor={htmlFor}>{text}</label>
    </div>
  );
};

Label.propTypes = {
  children: React.PropTypes.node,
  fieldName: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  htmlFor: React.PropTypes.string.isRequired,
};

Label.contextTypes = {
  values: React.PropTypes.instanceOf(Map),
};

export default Label;
