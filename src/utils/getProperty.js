import propOr from './propOr';
import unwrapJmlFragment from './unwrapJmlFragment';

/**
 * Gets a data property, for instance the attributes object or the name, of an JML object.
 * @param {string} name The name of the property
 * @param {Object} jmlObject The object to get the property from
 * @return {*|undefined} The property or undefined if the property doesn't exist.
 */
export default (name, jmlObject) => {
    const innerContent = unwrapJmlFragment(jmlObject);
    return propOr(undefined, name, innerContent);
};