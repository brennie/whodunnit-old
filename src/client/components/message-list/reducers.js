import {ADD_MESSAGE, DISMISS_MESSAGE} from './actions';


const defaultState = {
  messages: new Map(),
};

const messageList = (state=defaultState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return Object.assign({}, state, {
        messages: new Map(state.messages).set(action.id, action.message),
      });

    case DISMISS_MESSAGE: {
      const id = action.id;
      const message = state.messages.get(action.id);

      if (message === undefined)
        return state;

      const messages = new Map(state.messages);
      messages.delete(id);

      return Object.assign({}, state, {messages});
    }

    default:
      return state;
  }
};

export default messageList;
