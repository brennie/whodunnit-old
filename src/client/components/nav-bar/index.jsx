import React from 'react';

import './style.css';


export default class NavBar extends React.Component {
  render() {
    return (
      <header>
        <span className="brand">whodunnit&#8253;</span>
        <nav>
          <ul>
           <li><a href="#!/login">Log In</a></li>
           <li><a href="#!/register">Register</a></li>
          </ul>
        </nav>
      </header>
    );
  }
}
