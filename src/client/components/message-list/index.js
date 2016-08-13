import {connect} from 'react-redux';

import {dismissMessage,} from './actions';
import MessageList from './messageList';


const mapStateToProps = state => ({
  messages: state.messageList
});

const mapDispatchToProps = dispatch => ({
  dismissMessage: id => dispatch(dismissMessage(id)),
});

const MessageListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);

export default MessageListContainer;
