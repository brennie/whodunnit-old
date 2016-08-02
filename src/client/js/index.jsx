import React from 'react';
import ReactDOM from 'react-dom';


import Login from './components/login';

import './reset.css';
import './style.css';


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Login />, document.getElementById('content'));
});
