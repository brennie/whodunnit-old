import React from 'react';
import {Link} from 'react-router';

import './style.css';


const NavBar = ({user, logout}) => {
  const links = [];

  if (user) {
    links.push(
      <li key="/"><Link to="/">Home</Link></li>,
      <li key="/logout">
        <button className="button button--plain"
                onClick={logout}>
          Logout
        </button>
      </li>
    );
  } else {
    links.push(
      <li key="/login"><Link to="/login">Log In</Link></li>,
      <li key="/register"><Link to="/register">Register</Link></li>
    );
  }

  return (
    <header>
      <span className="brand">whodunnit&#8253;</span>
      <nav><ul>{links}</ul></nav>
    </header>
  );
};

NavBar.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func.isRequired,
};

export default NavBar;
