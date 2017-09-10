import getChildJmlFragments from './getChildJmlFragments';
import isNil from './isNil';
import wrapJmlFragments from './wrapJmlFragments';

/**
 * Extracts a JML objects' child content as an array of standalone JML objects.
 * @param {Object} jmlObject The JML object
 * @return {Object[]|null} The child element array or null if the element is not a valid JML object.
 */
export default jmlObject => {
    const childFragments = getChildJmlFragments(jmlObject);
    return isNil(childFragments) ? null : wrapJmlFragments(childFragments);
};