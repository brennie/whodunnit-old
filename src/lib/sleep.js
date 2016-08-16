/* global setTimeout */
/**
 * Create a promise that will be resolved after the specified duration.
 *
 * @param {number=0} time The time (in milliseconds) to wait.
 *
 * @returns {Promise} A promise that is resolved after `time` milliseconds.
 */
const sleep = (time=0) => new Promise(r => setTimeout(r, time));

export default sleep;
