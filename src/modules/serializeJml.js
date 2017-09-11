import extractNamespaces from '../utils/extractNamespaces';
import getChildJmlFragments from '../utils/getChildJmlFragments';
import getProperty from '../utils/getProperty';
import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import propOr from '../utils/propOr';
import types from '../constants/types';
import wrapJmlFragments from '../utils/wrapJmlFragments';

// Creates the payload a mapping function will be called with
const createMappingPayload = (jmlObject, content) => {
    const isText = getProperty('type', jmlObject) === types.TEXT;
    const text = getProperty('text', jmlObject);
    const attributes = getProperty('attributes', jmlObject);
    const name = getProperty('name', jmlObject);
    return isText
        ? {content: text}
        : {content, attributes, name};
};

// Find a specific namespace in an array of namespaces. The value can be either an URI or a prefix
const findNamespace = (namespaces, value, isUri = true) => {
    for (let i = 0; i < namespaces.length; i++) {
        const {prefix, uri} = namespaces[i];
        if (isUri && uri === value) return namespaces[i];
        if (!isUri && prefix === value) return namespaces[i];
    }
};

// Find the default namespace URI in an array of namespaces
const findDefaultUri = namespaces => {
    for (let i = 0; i < namespaces.length; i++) {
        const {prefix, uri} = namespaces[i];
        if (isNil(prefix)) return uri;
    }
};

// Find the matching mapping from the list of mappings according to the currently active name, namespaces and mapped namespaces
const findMapping = (mappings, activeName, activeNamespaces, options) => {
    const {namespaces: mappedNamespaces = []} = options;
    if (hasContent(activeNamespaces)) {
        const {prefix, name} = separateNameParts(activeName);
        const activeUri = hasContent(prefix) ? findNamespace(activeNamespaces, prefix, false).uri : findDefaultUri(activeNamespaces);
        const matchingPrefix = findNamespace(mappedNamespaces, activeUri).prefix;
        const prefixedActiveName = `${matchingPrefix}:${name}`;
        return mappings[prefixedActiveName];
    } else {
        return propOr(undefined, activeName, mappings);
    }
};

// Do the actual mapping
const mapContent = (jmlObject, activeNamespaces, content, mappings, options) => {
    const {skipEmpty = false} = options;
    const payload = createMappingPayload(jmlObject, content);
    if (typeof mappings === 'function') {
        return mappings(payload);
    } else {
        const mapping = findMapping(mappings, getProperty('name', jmlObject), activeNamespaces, options);
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

// Separate an object name in its name and prefix
const separateNameParts = prefixedName => {
    const colonPosition = prefixedName.indexOf(':');
    const prefix = colonPosition === -1 ? undefined : prefixedName.substring(0, colonPosition);
    const name = prefixedName.substring(colonPosition + 1);
    return {prefix, name};
};

// Recursive walk through a whole JML object tree and apply mappings
const transform = (jmlObject, parentAttributes, mappings, options) => {
    const mergedAttributes = Object.assign({...parentAttributes}, getProperty('attributes', jmlObject));
    let childContent = '';
    const childFragments = getChildJmlFragments(jmlObject);
    if (Array.isArray(childFragments)) {
        for (let i = 0; i < childFragments.length; i++) {
            const childFragment = childFragments[i];
            if (childFragment.type === types.TEXT) {
                const {text} = childFragment;
                if (/\S*/.test(text)) {
                    childContent += text;
                }
            } else {
                const childObject = wrapJmlFragments(childFragment)[0];
                const childTexts = transform(childObject, mergedAttributes, mappings, options);
                if (!isNil(childTexts)) {
                    childContent += childTexts;
                }
            }
        }
    }
    return mapContent(jmlObject, extractNamespaces(mergedAttributes), childContent, mappings, options);
};

// Validate the options object and throw errors if appropriate
const validateOptions = (options = {}) => {
    const {namespaces = []} = options;
    for (let i = 0; i < namespaces.length; i++) {
        if (isNil(namespaces[i].prefix)) throw Error(`Options not valid: ${JSON.stringify(namespaces[i])} doesn't have a prefix.`);
    }
};

/**
 * Serializes a JML object according to provided mappings. Content without mappings is removed.
 * @example
 * {
 *     'p' : 'p',
 *     'head' : 'h2',
 *     'href' : ({attributes, content, name}) => { ...do something }
 * }
 * @param {Object} jmlObject The JML object
 * @param {function|Object} [mappings] The mappings, either as a single function applied to all elements or in form of key-value pairs that describe the mappings for each child object. Individual functional mappings are called with an object that contains the already serialized child content, the attribute object and the current objects' name. <b>Note: The individual keys need to be prefixed and the prefix need to be declared in the namespaces options if objects with namespaces are to be mapped!</b>
 * @param {Object} options The options object
 * @param {Object[]} [options.namespaces=[]] Namespace objects
 * @param {string} options.namespaces[].prefix The namespace prefix. This is mandatory!
 * @param {string} options.namespaces[].uri The namespace URI
 * @param {boolean} [options.skipEmpty=false] Whether or not to skip empty elements
 * @return {null|string} The transformed object or null if the root element isn't a valid XML-JS compatible object.
 */
export default (jmlObject, mappings, options = {}) => {
    validateOptions(options);
    if (!hasContent(jmlObject) || !hasContent(mappings)) return '';
    return transform(jmlObject, {}, mappings, options);
};