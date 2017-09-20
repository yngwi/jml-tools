import isNil from './isNil';

/**
 * Finds the URI of the default namespace in an array of namespaces. The default namespace is assumed to be the first namespace without prefix.
 * @param {Object[]} namespaces=[] An array of namespace objects
 * @param {string} [namespaces[].prefix] The namespace's prefix
 * @param {string} namespaces[].uri The namespace's URI
 * @return {string|undefined} Returns the default namespace.
 */
export default namespaces => {
    if (!Array.isArray(namespaces)) return undefined;
    for (let i = 0; i < namespaces.length; i++) {
        const {prefix, uri} = namespaces[i];
        if (isNil(prefix)) return uri;
    }
};