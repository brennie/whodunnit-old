import React from 'react';


const ErrorList = ({fieldName, ...restProps}, {errors}) => {
  const entries = [];
  const fieldErrors = errors.get(fieldName);

  if (fieldErrors === undefined || fieldErrors.length === 0)
    return null;

  for (const [i, errorText] of fieldErrors.entries())
    entries.push(<li key={i}>{errorText}</li>);

  return (
    <ul {...restProps}>
      {entries}
    </ul>
  );
};

ErrorList.propTypes = {
  fieldName: React.PropTypes.string,
};

ErrorList.contextTypes = {
  errors: React.PropTypes.instanceOf(Map),
};

export default ErrorList;
