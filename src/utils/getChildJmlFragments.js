import isNil from './isNil';
import propOr from './propOr';
import unwrapJmlFragment from './unwrapJmlFragment';

/**
 * Extracts a JML objects' child content as an array of JML fragments.
 * @param {Object} jmlObject The JML object
 * @return {Object[]|null} The JML fragment array or null if the element is not a valid JML object.
 */
export default jmlObject => {
    const innerContent = unwrapJmlFragment(jmlObject);
    if (isNil(innerContent)) return null;
    const childElements = propOr(undefined, 'elements', innerContent);
    return isNil(childElements) ? [] : childElements;
};