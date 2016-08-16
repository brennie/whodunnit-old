import {setFormErrors, updateFormValues} from 'client/components/base/form/actions';

export const ENABLE_LOGIN_FORM = 'ENABLE_LOGIN_FORM';

export const enableLoginForm = enabled => ({
  type: ENABLE_LOGIN_FORM,
  enabled,
});

export const setLoginFormErrors = setFormErrors('login');
export const updateLoginFormValues = updateFormValues('login');
