import isString from './isString';
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
    if (!isString(namespaceName) || colonPosition === 0 || colonPosition === namespaceName.length - 1) throw new Error(`'${namespaceName}' is an invalid namespace name`);
    const prefix = colonPosition === -1 ? undefined : namespaceName.substring(0, colonPosition);
    const name = namespaceName.substring(colonPosition + 1);
    return hasContent(prefix) ? {prefix, name} : {name};
};