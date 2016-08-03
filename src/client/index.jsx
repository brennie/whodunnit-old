import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import './css/reset.css';


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('container'));
});
