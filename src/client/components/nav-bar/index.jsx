import React from 'react';
import {Link} from 'react-router';

import './style.css';


export default class NavBar extends React.Component {
  render() {
    return (
      <header>
        <span className="brand">whodunnit&#8253;</span>
        <nav>
          <ul>
           <li><Link to="/login">Log In</Link></li>
           <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}
