import getProperty from './getProperty';
import isNil from './isNil';
import hasContent from './hasContent';

const isFullObject = jml => Array.isArray(jml.elements);

/**
 * Extracts the namespace information from an JML objects' or fragments' attributes.
 * @param {Object} jml The JML object
 * @return {Object[]} Returns the namespace information in form of an object array with mandatory URIs and optional prefixes or an empty array.
 * @example
 * [{prefix: 'ns', uri: 'http://example.com/ns'}]
 * [{uri: 'http://example.com/default'}, {prefix: 'ns', 'uri: 'http://example.org/ns'}]
 */
export default jml => {
    if (isNil(jml)) return [];
    const attributes = isFullObject(jml) ? getProperty('attributes', jml) : jml.attributes;
    if (isNil(attributes)) return [];
    const names = Object.keys(attributes);
    const namespaces = [];
    for (let i = 0; i < names.length; i++) {
        const namespace = {};
        const name = names[i];
        if (name.startsWith('xmlns:')) {
            namespace.prefix = name.replace('xmlns:', '');
            namespace.uri = attributes[name];
        } else if (name === 'xmlns') {
            namespace.uri = attributes[name];
        }
        if (hasContent(namespace)) {
            namespaces.push(namespace);
        }
    }
    return namespaces;
};