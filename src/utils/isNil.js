/**
 * Tests if an object is undefined or null.
 * @param {*} object The object to test
 * @return {boolean} True if the object is undefined or null, otherwise false.
 */
export default object => typeof object === 'undefined' || object === null;