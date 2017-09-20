/**
 * Find a specific namespace in an array of namespaces. The value can be either an URI or a prefix.
 * @param {string} value The value of the namespace to find. Will be interpreted either as a prefix or as an URI depending on 'isUri'.
 * @param {Object[]} namespaces=[] An array of namespace objects
 * @param {string} namespaces[].prefix The namespace's prefix
 * @param {string} namespaces[].uri The namespace's URI
 * @param {boolean} [isUri=true] Whether or not the value is interpreted as an URI
 * @return {{prefix: string|undefined, uri: string}|undefined} Returns a single namespace object or undefined if there is no matching namespace.
 */
export default (value, namespaces, isUri = true) => {
    if (!Array.isArray(namespaces)) return undefined;
    for (let i = 0; i < namespaces.length; i++) {
        const {prefix, uri} = namespaces[i];
        if (!isUri && prefix === value || uri === value) return namespaces[i];
    }
};