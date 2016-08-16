/**
 * Create an object from an iterable.
 *
 * @param {*} it An iterator that yields `[key, value]` pairs.
 *
 * @returns {Object} The created object from the key, value pairs.
 */
export const objectFrom = it => {
  const o = {};

  for (const [k, v] of it)
    o[k] = v;

  return o;
};

/**
 * Create a clone of the object without the given properties.
 *
 * @param {Object} object The object to clone
 * @param {string[]} ...propNames The names of the excluded properties.
 *
 * @returns {Object} A shallow clone of `object` without the given properties.
 */
export const withoutProperties = (object, ...propNames) => {
  const o = Object.assign(object);

  for (const propName of propNames)
    delete o[propName];

  return o;
};
