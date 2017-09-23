/**
 * Shallow merges the properties of two objects into a new object. The properties of 'extensionObject' overwrite eventual properties in the 'baseObject' with the same key.
 * @param {Object} baseObject The base object
 * @param {Object} extensionObject The extension object.
 * @return {Object} Returns a new object with the properties of both source objects.
 */
export default (baseObject = {}, extensionObject = {}) => {
    const merged = {};
    const firstKeys = Object.keys(baseObject);
    for (let i = 0; i < firstKeys.length; i++) {
        const key = firstKeys[i];
        merged[key] = baseObject[key];
    }
    const secondKeys = Object.keys(extensionObject);
    for (let i = 0; i < secondKeys.length; i++) {
        const key = secondKeys[i];
        merged[key] = extensionObject[key];
    }
    return merged;
};