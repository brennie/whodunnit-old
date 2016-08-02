import React from 'react';

import LoginForm from '../components/login-form';
import NavBar from '../components/nav-bar';
import './style.css';


export default class App extends React.Component {
  render() {
    return (
      <div id="app-container">
        <NavBar />
        <div className="content">
          <LoginForm />
        </div>
        <footer>
          <p>Made with &#9825; by <a href="https://github.com/brennie/">brennie</a>.</p>
          <p>Contribute to this project on <a href="https://github.com/brennie/whodunnit">GitHub</a>.</p>
        </footer>
      </div>
    );
  }
}
