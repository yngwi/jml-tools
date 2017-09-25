import hasContent from './hasContent';

/**
 * Splits a namespace name in its name and prefix (if the name is prefixed) and returns an object with name and prefix.
 * @example
 * 'ns1:example' => {prefix: 'ns1', name: 'example'}
 * 'example' => {name: 'example'}
 * @param {string} namespaceName The name to split. Can optionally be prefixed.
 * @return {{prefix: string|undefined, name: string|undefined}} Returns the name parts.
 */
export default namespaceName => {
    if (!hasContent(namespaceName)) return {};
    const colonPosition = namespaceName.indexOf(':');
    if (colonPosition === -1) {
        return {name: namespaceName};
    } else if (colonPosition > 1) {
        const prefix = namespaceName.substring(0, colonPosition);
        const name = namespaceName.substring(colonPosition + 1);
        return {prefix, name};
    }
};