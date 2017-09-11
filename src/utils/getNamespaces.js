import getProperty from './getProperty';
import isNil from './isNil';
import extractNamespaces from './extractNamespaces';

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
    return extractNamespaces(attributes);
};