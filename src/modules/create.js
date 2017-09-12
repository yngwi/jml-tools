import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import isString from '../utils/isString';
import propOr from '../utils/propOr';
import types from '../constants/types';

const createAttributesObject = (attributes, namespaces = []) => {
    if (hasContent(attributes) || hasContent(namespaces)) {
        return {
            ...createNamespaceAttributes(namespaces),
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

const createContentObjectsArray = content => {
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

const createNamespaceAttributes = namespaces => {
    const namespaceAttributes = {};
    for (let i = 0; i < namespaces.length; i++) {
        const {prefix, uri} = namespaces[i];
        if (isString(prefix) && isString(uri)) {
            namespaceAttributes[`xmlns:${prefix}`] = uri;
        } else if (isString(uri)) {
            namespaceAttributes['xmlns'] = uri;
        }
    }
    return namespaceAttributes;
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
 * @param {string} name The name. It must include the prefix, if any
 * @param {Object} [data={}] The object data
 * @param {Object[]} [data.namespaces] Namespace objects
 * @param {string} [data.namespaces[].prefix] The namespace prefix
 * @param {string} data.namespaces[].uri The namespace URI
 * @param {Object|Array|string} [data.content] The child content, either as a JML object, an array of JML objects or text content
 * @param {Object} [data.attributes] Any attributes as an object of key-value pairs; the value needs to be a string or it will be converted to one
 * @return {Object} Returns the JML object.
 */
export default (name, data = {}) => {
    if (!isString(name)) throw new Error('The \'name\' parameter needs to be a string!');
    const {attributes, content, namespaces} = data;
    const contentObject = {
        type: types.ELEMENT,
        name,
    };
    const attributeObject = createAttributesObject(attributes, namespaces);
    if (hasContent(attributeObject)) {
        contentObject.attributes = attributeObject;
    }
    const childElements = createContentObjectsArray(content);
    if (hasContent(childElements)) {
        contentObject.elements = childElements;
    }
    return {
        elements: [contentObject],
    };
};