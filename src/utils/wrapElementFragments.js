import hasContent from './hasContent';
import isNil from './isNil';
import isString from './isString';
import types from '../constants/types';

const isJmlFragment = fragment => {
    if (Array.isArray(fragment) || typeof fragment === 'number' || isString(fragment) || isNil(fragment)) {
        return false;
    } else {
        return (fragment.type === types.ELEMENT && isString(fragment.name) && hasContent(fragment.name));
    }
};

/**
 * Wraps an JML fragment (for instance from the child content) so it is a valid JML object. A fragment is an object directly containing 'type' and 'name' properties as well as an optional 'attributes' object property and an optional 'elements' array property containing the child elements as fragments.
 * @example
 * {'name': 'person','type': 'element'} => {'elements': [{'name': 'person','type': 'element'}]}
 * @param {Object|Object[]} jmlFragments Either a single JML fragment or an array of fragments; each fragment will be wrapped individually.
 * @return {Object[]} An array of JML objects.
 * @throws Throws an error if jmlFragments includes objects that are not valid JML fragments.
 */
export default jmlFragments => {
    if (isNil(jmlFragments)) return [];
    const fragmentArray = Array.isArray(jmlFragments) ? jmlFragments : [jmlFragments];
    const wrapped = [];
    for (let i = 0; i < fragmentArray.length; i++) {
        const currentFragment = fragmentArray[i];
        if (!isJmlFragment(currentFragment)) {
            throw new Error(`Fragment '${JSON.stringify(currentFragment)}' is not a valid JML fragment.`);
        } else {
            wrapped.push({elements: [currentFragment]});
        }
    }
    return wrapped;
};