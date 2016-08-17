import React from 'react';

import notLoggedIn from 'client/components/abstract/notLoggedIn';
import RegisterFormContainer from './container';


const RegisterPage = notLoggedIn(RegisterFormContainer);
export default RegisterPage;
