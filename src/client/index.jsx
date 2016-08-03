import React from 'react';
import ReactDOM from 'react-dom';

import Router from './components/router';
import './css/reset.css';


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Router />, document.getElementById('container'));
});
