import sleep from 'lib/sleep';


let nextMessageID = 0;

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

/**
 * Add a message.
 *
 * @param {string} [id] An optional unique identifier for the message. If this
          is not provided (or is provided and is not a string), the message will
          be assigned a unique integer for its ID.
 * @param {string} text The message text.
 * @param {string} type The message type. This will be added to the
 *        message as the `data-message-type` attribute on the element in the
 *        DOM.
 * @param {int} [timeout] The timeout before the message is automatically
 *        dismissed. If not provided, the message will not be automatically
 *        dismissed.
 * @param {boolean} [userDismissable=true] Whether or not the user can dismiss
 *        the message.
 * @param {string} [appliesTo] An optional location that this message only
 *        applies to. The message will not be shown for any other locations.
 *
 * @returns {function(dispatch: function)} The action (as a thunk).
 */
export const addMessage = ({id, text, type, timeout, userDismissable, appliesTo}) => async dispatch => {
  if (id === undefined || typeof id !== 'string')
    id = nextMessageID++;

  userDismissable = userDismissable !== false;

  dispatch({
    type: ADD_MESSAGE,
    id,
    message: {
      appliesTo,
      text,
      type,
      userDismissable,
    },
  });

  if (timeout !== undefined) {
    await sleep(timeout);
    dispatch(dismissMessage(id));
  }
};

/**
 * Dismiss a message by its ID.
 *
 * @param {number} id The message's ID.
 *
 * @returns {Object} The dismiss action.
 */
export const dismissMessage = id => ({
  type: DISMISS_MESSAGE,
  id,
});
