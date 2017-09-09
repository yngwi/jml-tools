import isNil from './isNil';

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