import types from '../constants/types';

/**
 * Creates a text node-object that can be used as child content to create JSON-ML objects.
 * @see createElement.js
 * @param {string} text The text content
 * @return {object} The text node.
 */
export default text => {
    if (typeof text !== 'string') throw new Error('The \'text\' parameter needs to be a string!');
    return {
        elements: [{
            type: types.TEXT,
            text,
        }],
    };
};