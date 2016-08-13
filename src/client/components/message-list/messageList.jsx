import React from 'react';

import './style.css';


const MessageList = ({messages, dismissMessage}) => {
  const children = [];

  for (const [id, message] of messages.entries()) {
    const dismissIcon = (
      <button className="button--plain message-list__message__dismiss-button"
              onClick={e => dismissMessage(id)}>
        <span className="fa fa-times" />
      </button>
    );
    children.push(
      <li className="message-list__message"
          data-message-type={message.type}
          key={id}>
        <span>{message.text}</span>
        {message.userDismissable ? dismissIcon : null}
      </li>);
  }

  return (
    <div id="message-list-container">
      <ul className="message-list">{children}</ul>
    </div>
  );
}

export default MessageList;
