import {connect} from 'react-redux';

import {dismissMessage,} from './actions';
import MessageList from './messageList';


const messagesForLocation = state => {
  const location = state.routing.locationBeforeTransitions.pathname;

  return new Map(
    Array.from(
      state
        .messageList
        .messages
        .entries()
    )
    .filter(([,msg]) => msg.appliesTo === undefined || msg.appliesTo === location)
  );
};

const mapStateToProps = state => ({
  messages: messagesForLocation(state),
});

const mapDispatchToProps = dispatch => ({
  dismissMessage: id => dispatch(dismissMessage(id)),
});

const MessageListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);

export default MessageListContainer;
