/**
 * Create an object from an iterable.
 *
 * @param {*} it An iterator that yields `[key, value]` pairs.
 *
 * @returns {Object} The created object from the key, value pairs.
 */
export const objectFrom = it => {
  const o = {};

  for (const [k, v] of it) {
    o[k] = v;
  }

  return o;
}
