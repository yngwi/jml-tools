import addToArray from './addToArray';
import hasContent from './hasContent';

export default (attributes = {}) => {
    const names = Object.keys(attributes);
    const namespaces = [];
    for (let i = 0; i < names.length; i++) {
        const namespace = {};
        const name = names[i];
        if (name.startsWith('xmlns:')) {
            namespace.prefix = name.replace('xmlns:', '');
            namespace.uri = attributes[name];
        } else if (name === 'xmlns') {
            namespace.uri = attributes[name];
        }
        if (hasContent(namespace)) {
            addToArray(namespaces, namespace);
        }
    }
    return namespaces;
};