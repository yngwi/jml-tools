import extractNamespaces from '../utils/extractNamespaces';
import findDefaultNamespaceUri from '../utils/findDefaultNamespaceUri';
import findNamespace from '../utils/findNamespace';
import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import propOr from '../utils/propOr';
import splitNamespaceName from '../utils/splitNamespaceName';
import types from '../constants/types';

// Creates the payload a mapping function will be called with
const createMappingPayload = (jmlFragment, content) => jmlFragment.type === types.TEXT
    ? {content: jmlFragment.text}
    : {content, attributes: jmlFragment.attributes, name: jmlFragment.name};

// Find the matching mapping from the list of mappings according to the currently active name, namespaces and mapped namespaces
const findMapping = (mappings, activeName, activeNamespaces, options) => {
    let matchingMapping;
    const {namespaces: mappedNamespaces = []} = options;
    if (hasContent(activeNamespaces)) {
        const defaultUri = findDefaultNamespaceUri(activeNamespaces);
        const {prefix, name} = splitNamespaceName(activeName);
        if (isNil(defaultUri) && isNil(prefix)) {
            matchingMapping = propOr(undefined, activeName, mappings);
        } else {
            const activeUri = hasContent(prefix) ? findNamespace(prefix, activeNamespaces, false).uri : defaultUri;
            const matchingPrefix = propOr(undefined, 'prefix', findNamespace(activeUri, mappedNamespaces));
            const prefixedActiveName = `${matchingPrefix}:${name}`;
            matchingMapping = mappings[prefixedActiveName];
        }
    } else {
        matchingMapping = propOr(undefined, activeName, mappings);
    }
    return isNil(matchingMapping) ? mappings['*'] : matchingMapping;
};

// Do the actual mapping
const mapContent = (jmlFragment, activeNamespaces, content, mappings, options) => {
    const {skipEmpty = false} = options;
    const payload = createMappingPayload(jmlFragment, content);
    if (typeof mappings === 'function') {
        return mappings(payload);
    } else {
        const mapping = findMapping(mappings, jmlFragment.name, activeNamespaces, options);
        if (isNil(mapping)) {
            return undefined;
        } else if (skipEmpty && content === '') {
            return content;
        } else if (typeof mapping === 'function') {
            return mapping(payload);
        } else {
            return `<${mapping}>${content}</${mapping}>`;
        }
    }
};

// Recursive walk through a whole JML tree, extract content and apply mappings
const recursiveSerialize = (jmlFragment, parentAttributes, mappings, options) => {
    const mergedAttributes = Object.assign({...parentAttributes}, propOr({}, 'attributes', jmlFragment));
    let childContent = '';
    const childFragments = propOr([], 'elements', jmlFragment);
    for (let i = 0; i < childFragments.length; i++) {
        const childFragment = childFragments[i];
        if (childFragment.type === types.TEXT && /\S*/.test(childFragment.text)) {
            childContent += childFragment.text;
        } else {
            const childTexts = recursiveSerialize(childFragment, mergedAttributes, mappings, options);
            if (!isNil(childTexts)) {
                childContent += childTexts;
            }
        }
    }
    return mapContent(jmlFragment, extractNamespaces(mergedAttributes), childContent, mappings, options);
};

// Validate the options object and throw errors if appropriate
const validateOptions = (mappings = {}, options = {}) => {
    const {namespaces = []} = options;
    const names = Object.keys(mappings);
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const {prefix} = splitNamespaceName(name);
        const namespace = findNamespace(prefix, namespaces, false);
        if (!isNil(prefix) && isNil(namespace)) throw Error(`Options not valid: No namespace declared for prefix '${prefix}'`);
    }
};

/**
 * Serializes a JML object according to provided mappings. Content without mappings is removed.
 * @example
 * Mappings:
 * {
 *     'p': 'p',
 *     'head': 'h2',
 *     'href': ({attributes, content, name}) => { ...do something }
 *     '*': 'span' // wildcard
 * }
 * @param {Object} jmlObject The JML object
 * @param {function|Object} [mappings] The mappings, either as a single function applied to all elements or in form of key-value pairs that describe the mappings for each child object. Individual functional mappings are called with an object that contains the already serialized child content, the attribute object and the current objects' name. A '*' can be used as a wildcard for all not-mapped elements. <b>Note: To match a qualified object (that is in a namespace) the mapping needs to be prefixed and the matching namespace needs to be declared in options.namespaces!</b>
 * @param {Object} options The options object
 * @param {Object[]} [options.namespaces=[]] An array of namespace objects
 * @param {string} options.namespaces[].prefix The namespace's prefix
 * @param {string} options.namespaces[].uri The namespace's URI
 * @param {boolean} [options.skipEmpty=false] Whether or not to skip empty elements
 * @return {null|string} The transformed object or null if the root element isn't a valid XML-JS compatible object.
 */
export default (jmlObject, mappings, options = {}) => {
    validateOptions(mappings, options);
    if (!hasContent(jmlObject) || !hasContent(mappings)) return '';
    return recursiveSerialize(jmlObject.elements[0], {}, mappings, options);
};