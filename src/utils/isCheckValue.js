/**
 * Check object
 *
 * @param {object} value
 * @return {boolean}
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object';
};

/**
 * Check string
 *
 * @param {string} value
 * @return {boolean}
 */
export const isString = (value) => {
  return value !== null && typeof value == 'string';
};
