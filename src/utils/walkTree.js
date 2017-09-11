import extractNamespaces from './extractNamespaces';
import hasContent from './hasContent';
import propOr from './propOr';

const createCallbackPayload = (jml, namespaces, parentJml, parentNamespaces) => {
    const payload = {
        jml,
        namespaces: extractNamespaces(namespaces),
    };
    if (hasContent(parentJml)) {
        payload.parent = {
            jml: parentJml,
            namespaces: extractNamespaces(parentNamespaces),
        };
    }
    return payload;
};

const mergeNamespaces = (parent, current) => Object.assign({...parent}, current);

const walk = (jml, parentJml, parentNamespaces, callback) => {
    const currentNamespaces = propOr({}, 'attributes', jml);
    const mergedNamespaces = mergeNamespaces(parentNamespaces, currentNamespaces);
    const fragments = propOr([], 'elements', jml);
    for (let i = 0; i < fragments.length; i++) {
        walk(fragments[i], jml, mergedNamespaces, callback);
    }
    const payload = createCallbackPayload(jml, mergedNamespaces, parentJml, parentNamespaces);
    callback(payload);
};

/**
 * Recursively walks a JML object and calls a callback with each child fragment it encounters. The callback is called with an object containing the following information:
 * {Object} <i>jml:</i> The current jml fragment
 * {Object[]} <i>namespaces:</i> The namespaces currently active. All namespace declarations up to the JML root are taken into account so if the current fragment doesn't have namespace information but ancestors do, the information of the closest ancestor is available in this property.
 * {Object} <i>parent:</i> The parent data
 * {Object} <i>parent.jml:</i> The parent JML object
 * {Object[]} <i>parent.namespaces:</i> The active namespaces for the parent object
 * @param {Object} jmlObject The object to walk through
 * @param {Function} callback The callback to execute during each step
 */
export default (jmlObject, callback = payload => payload) => {
    const jmlRoot = propOr([], 'elements', jmlObject)[0];
    walk(jmlRoot, undefined, {}, callback);
};