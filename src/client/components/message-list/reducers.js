import {ADD_MESSAGE, DISMISS_MESSAGE} from './actions';


const defaultState = {
  messages: new Map(),
  uniqueIDs: new Map(),
};

const messageList = (state=defaultState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      const id = action.id;
      const uniqueID = action.message.uniqueID;
      let uniqueIDs = state.uniqueIDs;

      if (uniqueID !== undefined) {
        if (state.uniqueIDs.has(uniqueID)) {
          return state;
        }

        uniqueIDs = new Map(uniqueIDs);
        uniqueIDs.set(uniqueID, id);
      }

      return {
        messages: new Map(state.messages).set(action.id, action.message),
        uniqueIDs,
      };
    }

    case DISMISS_MESSAGE: {
      const id = action.id !== undefined ? action.id : state.uniqueIDs.get(action.uniqueID);

      if (id === undefined) {
        return state;
      }

      const message = state.messages.get(id);

      if (message !== undefined) {
        const messages = new Map(state.messages);
        messages.delete(id);

        let uniqueIDs = state.uniqueIDs;

        if (message.uniqueID) {
          uniqueIDs = new Map(uniqueIDs);
          uniqueIDs.delete(message.uniqueID);
        }

        return {messages, uniqueIDs};
      }

      return state;
    }

    default:
      return state;
  }
};

export default messageList;
