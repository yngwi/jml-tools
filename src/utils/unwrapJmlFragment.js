import isNil from './isNil';

/**
 * Unwraps the inner content of an JML object. Each JML object has a single 'element' array property. It has a single fragment object that signifies the root markup element. This method gets this fragment.
 * @param {Object} jmlObject A JML object
 * @return {Object|null} Returns the top level JML fragment or null if the object isn't a valid JML object.
 * @example:
 * {'elements': [{'name': 'person','type': 'element'}]} => {'name': 'person','type': 'element'}
 */
export default jmlObject => {
    if(isNil(jmlObject)) return null;
    const innerElements = jmlObject.elements;
    return Array.isArray(innerElements) ? innerElements[0] : null;
};