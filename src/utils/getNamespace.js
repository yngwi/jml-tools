import getProperty from './getProperty';
import isNil from './isNil';

const isFullObject = jml => Array.isArray(jml.elements);

/**
 * Extracts the namespace information from an JML objects' or fragments' attributes.
 * @param {Object} jml The JML object
 * @return {Object} Returns the namespace information in form of an object with a mandatory uri and an optional prefix property or an empty object.
 * @example
 * {prefix: 'ex', uri: 'http://example.com/ex'}
 */
export default jml => {
    if (isNil(jml)) return {};
    const attributes = isFullObject(jml) ? getProperty('attributes', jml) : jml.attributes;
    if (isNil(attributes)) return {};
    const names = Object.keys(attributes);
    const namespaceData = {};
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.startsWith('xmlns:')) {
            namespaceData.prefix = name.replace('xmlns:', '');
            namespaceData.uri = attributes[name];
        } else if (name === 'xmlns') {
            namespaceData.uri = attributes[name];
        }
    }
    return namespaceData;
};