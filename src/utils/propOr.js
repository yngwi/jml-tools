import isNil from './isNil';

/**
 * Returns an object's property or a substitute if the property is not existing.
 * @param {*} substitute The substitute to return instead of the property
 * @param {string} propName The name of the property
 * @param {Object} object The source object
 * @return {*} The property or the substitute.
 */
export default (substitute, propName, object) => {
    if (isNil(substitute) && isNil(propName) && isNil(object)) {
        return undefined;
    } else if (isNil(propName) || isNil(object)) {
        return substitute;
    } else {
        const value = object[propName];
        return isNil(value) ? substitute : value;
    }
};