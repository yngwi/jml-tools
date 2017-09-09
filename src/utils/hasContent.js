/**
 * Tests whether or not an item has any content. No content means either undefined, null, being an empty array, object or string.
 * @param {*} item The item to test
 * @return {boolean} True if the item has any content.
 */
export default item => {
    if (typeof item === 'undefined' || item === null) {
        return false;
    } else if (Array.isArray(item)) {
        return item.length > 0;
    } else if (typeof item === 'string') {
        return item.trim() !== '';
    } else if (typeof item === 'object') {
        return !(Object.keys(item).length === 0 && item.constructor === Object);
    } else {
        return true;
    }
};