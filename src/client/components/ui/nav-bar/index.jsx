import React from 'react';
import {Link} from 'react-router';

import './style.css';


const NavBar = () => (
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


export default NavBar;
