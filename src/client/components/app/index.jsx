import React from 'react';

import MessageListContainer from 'client/components/ui/message-list';
import NavBar from 'client/components/ui/nav-bar';
import './style.css';


const App = ({children}) => (
  <div id="app-container">
    <NavBar />
    <MessageListContainer />
    <div className="content">{children}</div>
    <footer>
      <p>Made with &#9825; by <a href="https://github.com/brennie/">brennie</a>.</p>
      <p>Contribute to this project on <a href="https://github.com/brennie/whodunnit">GitHub</a>.</p>
    </footer>
  </div>
);

App.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default App;
