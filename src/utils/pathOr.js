import hasContent from './hasContent';

const getProp = (substitute, path, object) => {
    if (!hasContent(object) || !Array.isArray(path)) {
        return substitute;
    } else if (path.length > 0) {
        const currentPath = path[0];
        const currentMatch = object[currentPath];
        if (typeof currentMatch === 'undefined') {
            return substitute;
        } else {
            return getProp(substitute, path.slice(1), currentMatch);
        }
    } else {
        return object;
    }
};

/**
 * Tries to resolves a path to an objects' sub-property. Returns a substitute if the path cannot be resolved.
 * @param {*} substitute The substitute to return if the path cannot be resolved
 * @param {string[]} path The path to resolve as an array of keys
 * @param {Object} object The object to resolve the path in
 * @return {Object} The sub-property or the substitute.
 */
export default (substitute, path, object) => getProp(substitute, path, object);