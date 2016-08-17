import {setFormErrors, updateFormValues} from 'client/components/ui/form/actions';

export const ENABLE_REGISTER_FORM = 'ENABLE_REGSITER_FORM';

export const enableRegisterForm = enabled => ({
  type: ENABLE_REGISTER_FORM,
  enabled,
});

export const setRegisterFormErrors = setFormErrors('register');
export const updateRegisterFormValues = updateFormValues('register');
