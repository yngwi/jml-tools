import hasContent from '../utils/hasContent';
import isString from '../utils/isString';
import propOr from '../utils/propOr';
import rejectEmpty from '../utils/rejectEmpty';
import wrapJmlFragments from '../utils/wrapJmlFragments';

const PATH_WILDCARD = '%';

const applyPositionFilter = (items, filter) => {
    const {position} = filter;
    if (hasContent(position)) {
        return [items[position]];
    } else {
        return items;
    }
};

const childAttributes = jsonML => propOr([], 'attributes', jsonML);

const childElements = jsonML => {
    if (Array.isArray(jsonML)) {
        const children = [];
        for (let i = 0; i < jsonML.length; i++) {
            children.push(...propOr([], 'elements', jsonML[i]));
        }
        return children;
    } else {
        return propOr([], 'elements', jsonML);
    }
};

const createFilterConfig = (filterString = '') => {
    const parts = filterString.split('&');
    const filter = {};
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (Number(part) > 0) {
            filter.position = Number(part) - 1;
        } else if (/^@.*=.*$/.test(part)) {
            const attributeParts = part.replace('@', '').split('=');
            filter.attribute = {
                name: attributeParts[0],
                value: attributeParts[1],
            };
        }
    }
    return filter;
};

// Extracts the root element content for relative paths.
const extractRoot = (jsonML, path) => path.startsWith('/') ? jsonML : childElements(jsonML)[0];

// Calls the correct finder function for the current path segment (element, attribute, text)
const findMatching = ({pathSegment, filterString}, jsonMLFragment) => {
    const filter = createFilterConfig(filterString);
    if (pathSegment === 'text()') {
        return findTexts(jsonMLFragment, filter);
    } else if (pathSegment.startsWith('@')) {
        return findMatchingAttributes(pathSegment, jsonMLFragment, filter);
    } else {
        return findMatchingElements(pathSegment, jsonMLFragment, filter);
    }
};

const findMatchingAttributes = (pathSegment, jsonMLFragment, filter) => {
    const name = pathSegment.replace('@', '');
    const attributes = childAttributes(jsonMLFragment);
    const value = attributes[name];
    if (hasContent(value)) {
        return applyPositionFilter([value], filter);
    } else {
        return [];
    }
};

const findMatchingElements = (pathSegment, jsonMlFragment, filter) => {
    const elements = childElements(jsonMlFragment);
    const matchingElements = [];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.name === pathSegment && isItemAttributeMatching(element, filter)) {
            matchingElements.push(element);
        }
    }
    return applyPositionFilter(matchingElements, filter);
};

const findTexts = (jsonMlFragment, filter) => {
    const elements = childElements(jsonMlFragment);
    const matchingElements = [];
    for (let i = 0; i < elements.length; i++) {
        const text = elements[i].text;
        if (hasContent(text)) {
            matchingElements.push(text);
        }
    }
    return applyPositionFilter(matchingElements, filter);
};

const isItemAttributeMatching = (item, filter) => {
    const {attribute} = filter;
    if (hasContent(attribute)) {
        const attributes = childAttributes(item);
        return attributes[attribute.name] === attribute.value;
    } else {
        return true;
    }
};

// Recursively finds the matching path segments
const match = (jsonMLFragments, pathSegments) => {
    if (noContent(pathSegments)) {
        return jsonMLFragments;
    } else {
        const matching = [];
        const currentSegment = splitPathSegment(pathSegments[0]);
        for (let i = 0; i < jsonMLFragments.length; i++) {
            const fragment = jsonMLFragments[i];
            matching.push(...findMatching(currentSegment, fragment));
        }
        return [
            ...currentSegment.hasWildcard && hasContent(jsonMLFragments) // add all child elements for wildcard search
                ? match(childElements(jsonMLFragments), pathSegments)
                : [],
            ...noContent(matching)
                ? []
                : match(matching, pathSegments.slice(1)),
        ];
    }
};

const noContent = x => !hasContent(x);

const splitPath = path => rejectEmpty(path.replace('//', `/${PATH_WILDCARD}`).split('/'));

// Splits the path segment in the actual path and the filter
const splitPathSegment = pathSegment => {
    const parts = pathSegment.replace('][', '&').replace(']', '').replace(/\s*=\s*/, '=').split('[');
    return {
        pathSegment: parts[0].replace(PATH_WILDCARD, ''),
        filterString: parts[1],
        hasWildcard: parts[0].startsWith(PATH_WILDCARD),
    };
};

const validatePath = path => {
    if (!isString(path) || path === '/' || (path !== '' && !path.startsWith('/'))) throw new Error(`${JSON.stringify(path)} is not a valid path`);
};

/**
 *
 * @param {string} path The path to evaluate
 * @param {Object} jml The JML object to evaluate the path on
 * @param {Object} [options] The evaluation options
 * @param {Object[]} [options.namespaces] An array of namespace objects
 * @param {string} [options.namespaces[].prefix] The namespace's prefix
 * @param {string} options.namespaces[].uri The namespace's URI
 * @return {Object[]} Returns an array with all matching parts of the evaluated JML object.
 */
export default (path, jml, options = {}) => {
    validatePath(path);
    if (!hasContent(jml)) return [];
    const jsonMLArray = [];
    jsonMLArray.push(extractRoot(jml, path));
    const segments = splitPath(path);
    return noContent(segments) ? jsonMLArray : wrapJmlFragments(match(jsonMLArray, segments));
};