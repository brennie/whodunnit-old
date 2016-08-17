export const SET_FORM_ERRORS = formName =>  `SET_${formName.toUpperCase()}_FORM_ERRORS`;
export const UPDATE_FORM_VALUES = formName => `UPDATE_${formName.toUpperCase()}_FORM_VALUES`;

export const setFormErrors = formName => errors => ({
  type: SET_FORM_ERRORS(formName),
  errors,
});

export const updateFormValues = formName => values => ({
  type: UPDATE_FORM_VALUES(formName),
  values,
});

