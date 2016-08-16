/* global process */
import {createStore as createReduxStore, compose} from 'redux';

let createStore;

/* Expose the appropriate `createStore` method on production and development.
 *
 * When built with webpack, only one branch will be compiled. This way
 * devtools won't be enabled on production builds.
 */
if (process.env.NODE_ENV === 'production')
  createStore = createReduxStore;
else {
  /**
   * Create the store for development use.
   *
   * This will load the Redux DevTools extension if it is installed.
   *
   * @see https://github.com/zalmoxisus/redux-devtools-extension
   * @see https://github.com/reactjs/redux/blob/master/docs/api/createStore.md
   *
   * @param {function} reducer The store reducer.
   * @param {[]Object} [middleware] The middleware to use.
   * @param {function} [enhancer] The store enhancer, such as middleware.
   *
   * @returns {Object} The store.
   */
  createStore = (reducer, initialState, enhancer) => createReduxStore(
    reducer,
    initialState,
    compose(
      enhancer ? enhancer : e => e,
      window.devToolsExtension ? window.devToolsExtension() : e => e
    )
  );
}

export default createStore;
