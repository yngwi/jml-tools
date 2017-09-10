import isNil from './isNil';
import propOr from './propOr';
import unwrapJmlFragment from './unwrapJmlFragment';
import wrapJmlFragments from './wrapJmlFragments';

/**
 * Extracts a JML objects' child content as an array of standalone JML objects.
 * @param {Object} jmlObject The JML object
 * @return {Object[]|null} The child element array or null if the element is not a valid JSON-ML object.
 */
export default jmlObject => {
    const innerContent = unwrapJmlFragment(jmlObject);
    if (isNil(innerContent)) {
        return null;
    }
    const childElements = propOr(undefined, 'elements', innerContent);
    return isNil(childElements) ? [] : wrapJmlFragments(childElements);
};