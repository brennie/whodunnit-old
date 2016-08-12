import React from 'react';

import './style.css';


const MessageList = ({messages, dismissMessage, dismissMessageByUniqueID}) => {
  const children = [];

  for (const [id, message] of messages.entries()) {
    const onClickDismiss = message.uniqueID !== undefined
      ? (e) => dismissMessageByUniqueID(message.uniqueID)
      : (e) => dismissMessage(id);

    const dismissIcon = (
      <button className="button--plain message-list__message__dismiss-button" onClick={onClickDismiss}>
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
