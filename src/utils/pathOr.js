import hasContent from './hasContent';

const getProp = (substitute, path, object) => {
    if (!hasContent(object)) {
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

export default (substitute, path, object) => getProp(substitute, path, object);