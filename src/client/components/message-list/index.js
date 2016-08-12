import {connect} from 'react-redux';

import {dismissMessage, dismissMessageByUniqueID} from './actions';
import MessageList from './messageList';


const mapStateToProps = state => ({
  messages: state.messageList.messages,
});

const mapDispatchToProps = dispatch => ({
  dismissMessage: id => dispatch(dismissMessage(id)),
  dismissMessageByUniqueID: uniqueID => dispatch(dismissMessageByUniqueID(uniqueID)),
});

const MessageListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);

export default MessageListContainer;
