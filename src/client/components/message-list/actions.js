import sleep from 'lib/sleep';


let nextMessageID = 0;

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

/**
 * Add a message.
 *
 * @param {Object} options The action options.
 * @param {string} options.text The message text.
 * @param {string} options.type The message type. This will be added to the
 *        message as the `data-message-type` attribute on the element in the
 *        DOM.
 * @param {int} [options.timeout] The timeout before the message is
 *        automatically dismissed. If not provided, the message will not be
 *        automatically dismissed.
 * @param {boolean} [options.userDismissable=true] Whether or not the user can
 *        dismiss the message.
 *
 * @returns {function(dispatch: function)} The action (as a thunk).
 */
export const addMessage = ({text, type, uniqueID, timeout, userDismissable}) => async dispatch => {
  const id = nextMessageID++;
  userDismissable = userDismissable !== false;

  dispatch({
    type: ADD_MESSAGE,
    id,
    message: {
      text,
      type,
      uniqueID,
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

/**
 * Dismiss a message by its unique ID.
 *
 * @param {string} uniqueID The message's unique ID.
 *
 * @returns {Object} The dismiss action.
 */
export const dismissMessageByUniqueID = uniqueID => ({
  type: DISMISS_MESSAGE,
  uniqueID,
});
