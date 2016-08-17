import React from 'react';

import notLoggedIn from 'client/components/abstract/notLoggedIn';
import LoginFormContainer from './container';


const LoginPage = notLoggedIn(LoginFormContainer);
export default LoginPage;
