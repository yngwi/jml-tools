import createTextNode from '../utils/createTextNode';
import isNil from '../utils/isNil';
import propOr from '../utils/propOr';
import types from '../constants/types';

const childElement = childContent => {
    if (isString(childContent)) {
        const textNode = createTextNode(childContent);
        return propOr(undefined, 'elements', textNode);
    } else {
        return propOr(undefined, 'elements', childContent);
    }
};

const createElementsArray = childContent => {
    const elements = [];
    const contentArray = Array.isArray(childContent) ? childContent : [childContent];
    for (let i = 0; i < contentArray.length; i++) {
        const element = childElement(contentArray[i]);
        if (!isNil(element)) {
            elements.push(element[0]);
        }
    }
    return elements.length > 0 ? elements : undefined;
};

const isString = item => typeof item === 'string';

const mergeNamespace = (attributes, prefix, uri) => {
    const namespaceAttribute = {};
    namespaceAttribute[`xmlns:${prefix}`] = uri;
    return {
        ...attributes,
        ...namespaceAttribute,
    };
};

/**
 * Creates an JSON object that can be converted to an XML element using the XML-js library (https://github.com/nashwaan/xml-js).
 * @param {string} name The name of the object
 * @param {string} [prefix] The namespace prefix for the element
 * @param {string} [uri] The namespace uri for the element
 * @param {array|object|string} [childContent] The child content as an single object, an array of element and text nodes or strings.
 * @param {object} [attributes] Any attributes as an object of key-value pairs.
 * @return {object} Returns a JSON object that can be converted to a valid XML element.
 */
export default (name, prefix, uri, childContent, attributes) => {
    if (!isString(name)) throw new Error('The \'name\' parameter needs to be a string!');
    return {
        elements: [{
            type: types.ELEMENT,
            name: isString(prefix) ? `${prefix}:${name}` : name,
            attributes: isString(prefix) && isString(uri) ? mergeNamespace(attributes, prefix, uri) : attributes,
            elements: createElementsArray(childContent),
        }],
    };
};