import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import isString from '../utils/isString';
import propOr from '../utils/propOr';
import types from '../constants/types';

const createAttributesObject = (attributes, namespace = {}) => {
    if (hasContent(attributes) || hasContent(namespace)) {
        return {
            ...createNamespaceAttribute(namespace),
            ...stringifyAttributes(attributes),
        };
    }
};

const createChildObjectArray = childContent => isString(childContent)
    ? [{
        type: types.TEXT,
        text: childContent,
    }]
    : propOr(undefined, 'elements', childContent);

const createContentElementsArray = content => {
    if (hasContent(content)) {
        const elements = [];
        const contentArray = Array.isArray(content) ? content : [content];
        for (let i = 0; i < contentArray.length; i++) {
            const element = createChildObjectArray(contentArray[i]);
            if (!isNil(element)) {
                elements.push(element[0]);
            }
        }
        return elements;
    }
};

const createName = (name, namespace = {}) => {
    const {prefix} = namespace;
    return isString(prefix)
        ? `${prefix}:${name}`
        : name;
};

const createNamespaceAttribute = namespace => {
    const {prefix, uri} = namespace;
    const namespaceAttribute = {};
    if (isString(prefix) && isString(uri)) {
        namespaceAttribute[`xmlns:${prefix}`] = uri;
    } else if (isString(uri)) {
        namespaceAttribute['xmlns'] = uri;
    }
    return namespaceAttribute;
};

const stringifyAttributes = (attributes = []) => {
    const keys = Object.keys(attributes);
    const valid = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = attributes[key];
        valid[key] = isString(value) ? value : JSON.stringify(value);
    }
    return valid;
};

/**
 * Creates a JML object.
 * @param {string} name The name
 * @param {Object} [data={}] The object data
 * @param {Object} [data.namespace] The namespace object
 * @param {string} [data.namespace.prefix] The namespace prefix for the element
 * @param {string} data.namespace.uri The namespace URI for the element
 * @param {Object|Array|string} [data.content] The child content either as an JML object, an array of JML objects or text content
 * @param {Object} [data.attributes] Any attributes as an object of key-value pairs where the value needs to be a string
 * @return {Object} Returns a JSON object that can be converted to a valid XML element.
 */
export default (name, data = {}) => {
    if (!isString(name)) throw new Error('The \'name\' parameter needs to be a string!');
    const {attributes, content, namespace} = data;
    const contentObject = {
        type: types.ELEMENT,
        name: createName(name, namespace),
    };
    const attributeObject = createAttributesObject(attributes, namespace);
    if (hasContent(attributeObject)) {
        contentObject.attributes = attributeObject;
    }
    const childElements = createContentElementsArray(content);
    if (hasContent(childElements)) {
        contentObject.elements = childElements;
    }
    return {
        elements: [contentObject],
    };
};