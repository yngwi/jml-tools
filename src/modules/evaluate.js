import addToArray from '../utils/addToArray';
import extractNamespaces from '../utils/extractNamespaces';
import findNamespace from '../utils/findNamespace';
import findDefaultNamespaceUri from '../utils/findDefaultNamespaceUri';
import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import isString from '../utils/isString';
import mergeObjects from '../utils/mergeObjects';
import propOr from '../utils/propOr';
import pathOr from '../utils/pathOr';
import splitNamespaceName from '../utils/splitNamespaceName';

const DESCENDANTS_SELECTOR = '%';
const POSITION_SELECTOR = '#';
const REGEX_CONDITION_OPERATOR = /(=|!=|<|<=|>|>=)/;
// eslint-disable-next-line no-useless-escape
const REGEX_CONDITIONS = /\[[^\[]*\]/;
const REGEX_DOT_SLASH = /\.\//;
const REGEX_DOUBLE_SLASH = /\/\//g;
const REGEX_IS_CONDITION_PATH_PART = /(\.\/|@|text\(\))/;
const REGEX_IS_TEXT_OR_WILDCARD = /(^(text\(\)|\*)$)/;
const REGEX_NUMERIC_POSITION_SELECTOR = /.*#/;
const REGEX_POSITION_SELECTOR = /\[\d*\]/;
const REGEX_QUOTES = /["']/g;
const REGEX_SLASH_AT = /\/@/;
const REGEX_SLASH_OUTSIDE_CONDITIONS = /\/+(?![^[]*?\])/;
// eslint-disable-next-line no-useless-escape
const REGEX_SQUARE_BRACKETS = /[\[\]]/g;
// eslint-disable-next-line no-useless-escape
const REGEX_STEP_NOT_NAME = new RegExp(`(${DESCENDANTS_SELECTOR}|[@\[${POSITION_SELECTOR}}].*)`, 'g');

// extract the contents according to a step
const extractContent = (step, jmlFragment, attributes) => {
    if (step.endsWith('text()')) {
        return jmlFragment.text;
    } else if (step.includes('@')) {
        const attributeName = step.substring(step.lastIndexOf('@') + 1);
        return pathOr(undefined, ['attributes', attributeName], jmlFragment);
    } else {
        return hasContent(attributes)
            ? updateNamespacesFromAttributes(jmlFragment, attributes)
            : jmlFragment;
    }
};

// split a simplified path into its individual steps
const getPathSteps = simplePath => simplePath.split(REGEX_SLASH_OUTSIDE_CONDITIONS);

// tests whether or not a JML fragment matches a step including namespace and conditions
const isMatching = (completeStep, jmlFragment, activeAttributes = {}, declaredNamespaces = []) => {
    const {name, conditions} = separateNameAndConditions(completeStep);
    return isMatchingName(name, jmlFragment, activeAttributes, declaredNamespaces)
        && isMatchingConditions(conditions, jmlFragment, activeAttributes, declaredNamespaces);
};

// tests whether or not a JML fragment matches some conditions
const isMatchingConditions = (conditions = [], jmlFragment, activeAttributes, declaredNamespaces) => {
    let isMatching = true;
    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const operator = condition.match(REGEX_CONDITION_OPERATOR)[0];
        const operands = condition.split(operator);
        const evaluatedOperands = [];
        for (let j = 0; j < 2; j++) {
            const value = REGEX_IS_CONDITION_PATH_PART.test(operands[j])
                ? recursiveEvaluate(getPathSteps(operands[j]), [jmlFragment], activeAttributes, declaredNamespaces)[0]
                : operands[j].replace(REGEX_QUOTES, '');
            addToArray(evaluatedOperands, hasContent(value) ? value : '');
        }
        let comparisonResult;
        switch (operator) {
            case '=':
                comparisonResult = evaluatedOperands[0] === evaluatedOperands[1];
                break;
            case '!=':
                comparisonResult = evaluatedOperands[0] !== evaluatedOperands[1];
                break;
            case '<':
                comparisonResult = evaluatedOperands[0] < evaluatedOperands[1];
                break;
            case '<=':
                comparisonResult = evaluatedOperands[0] <= evaluatedOperands[1];
                break;
            case '>':
                comparisonResult = evaluatedOperands[0] > evaluatedOperands[1];
                break;
            case '>=':
                comparisonResult = evaluatedOperands[0] >= evaluatedOperands[1];
                break;
        }
        if (!comparisonResult) isMatching = false;
    }
    return isMatching;
};

// test whether or not a fragment matches a qualified name
const isMatchingName = (name, jmlFragment, activeAttributes, declaredNamespaces) => {
    if (!hasContent(name) || REGEX_IS_TEXT_OR_WILDCARD.test(name)) return true;
    const activeNamespaces = extractNamespaces(activeAttributes);
    const fragmentDefaultUri = findDefaultNamespaceUri(activeNamespaces);
    const {prefix: fragmentPrefix, name: fragmentName} = splitNamespaceName(jmlFragment.name);
    if (!hasContent(activeNamespaces) || isNil(fragmentDefaultUri) && isNil(fragmentPrefix)) {
        return fragmentName === name;
    } else if (name[0] === '*') {
        const unqualifiedName = name.replace('*:', '');
        return fragmentName === unqualifiedName;
    } else {
        const fragmentUri = hasContent(fragmentPrefix) ? findNamespace(fragmentPrefix, activeNamespaces, false).uri : fragmentDefaultUri;
        const declaredNamespace = findNamespace(fragmentUri, declaredNamespaces);
        const declaredPrefix = propOr(undefined, 'prefix', declaredNamespace);
        if (hasContent(declaredNamespace) && isNil(declaredPrefix)) throw new Error(`No prefix declared for URI '${fragmentUri}'`);
        return `${declaredPrefix}:${fragmentName}` === name;
    }
};

// recursively evaluate an array of steps on an array of JML fragments and return matching content
const recursiveEvaluate = (steps, jmlFragments = [], parentAttributes = {}, declaredNamespaces = []) => {
    const currentStep = steps[0];
    const remainingSteps = steps.slice(1);
    const results = [];
    for (let i = 0; i < jmlFragments.length; i++) {
        const currentJmlFragment = jmlFragments[i];
        const mergedAttributes = mergeObjects(parentAttributes, currentJmlFragment.attributes);
        if (isMatching(currentStep, currentJmlFragment, mergedAttributes, declaredNamespaces)) {
            if (steps.length === 1) {
                addToArray(results, extractContent(currentStep, currentJmlFragment, mergedAttributes));
            } else {
                addToArray(results, recursiveEvaluate(remainingSteps, currentJmlFragment.elements, mergedAttributes, declaredNamespaces));
            }
        }
        if (currentStep.startsWith(DESCENDANTS_SELECTOR)) {
            addToArray(results, recursiveEvaluate(steps, currentJmlFragment.elements, mergedAttributes, declaredNamespaces));
        }
    }
    return currentStep.includes(POSITION_SELECTOR)
        ? results[currentStep.replace(REGEX_NUMERIC_POSITION_SELECTOR, '') - 1]
        : results;
};

// split a step into its name and conditions parts and return them in an object
const separateNameAndConditions = (step = '') => {
    let name = step.replace(REGEX_STEP_NOT_NAME, '');
    let conditions = step.match(REGEX_CONDITIONS);
    conditions = Array.isArray(conditions) ? conditions : [];
    const cleanConditions = [];
    for (let i = 0; i < conditions.length; i++) {
        addToArray(cleanConditions, conditions[i].replace(REGEX_SQUARE_BRACKETS, ''));
    }
    return {
        name: name,
        conditions: cleanConditions,
    };
};

// simplify a path to ease evaluation
const simplifyPath = (path = '') => {
    let simplePath = path.replace(REGEX_DOUBLE_SLASH, `/${DESCENDANTS_SELECTOR}`).replace(REGEX_SLASH_AT, '@').replace(REGEX_DOT_SLASH, '/');
    const positionSelectors = simplePath.match(REGEX_POSITION_SELECTOR);
    if (hasContent(positionSelectors)) {
        for (let i = 0; i < positionSelectors.length; i++) {
            const selector = positionSelectors[i];
            const number = selector.replace(REGEX_SQUARE_BRACKETS, '');
            simplePath = simplePath.replace(selector, `${POSITION_SELECTOR}${number}`);
        }
    }
    return simplePath.substring(1); // omit the first '/'
};

// updates an JML fragments namespace attributes from a provided attributes object
const updateNamespacesFromAttributes = (jmlFragment, attributes) => {
    const names = Object.keys(attributes);
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.startsWith('xmlns')) {
            if (!hasContent(jmlFragment.attributes)) jmlFragment.attributes = {};
            jmlFragment.attributes[name] = attributes[name];
        }
    }
    return jmlFragment;
};

// wrap an array of evaluation result fragments into element objects to be proper JML objects
const wrapResults = (results = []) => {
    if (Array.isArray(results)) {
        const wrapped = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (isString(result)) {
                addToArray(wrapped, result);
            } else {
                if (hasContent(result)) {
                    addToArray(wrapped, {elements: [result]});
                }
            }
        }
        return wrapped;
    } else {
        return [results];
    }
};

/**
 * Evaluates a path expression similar to XPath on a JML object.
 * Differences to XPath:
 * * The value of an attribute can be accessed directly by /something/@attribute instead of data(/something/@attribute) or /something/@attribute/string()
 * * Considering the following xml <persons><person><name><given>Freddy</given></name></person><person><name><given>Brian</given></name></person></persons> '//given[1]' returns the first of all 'given' elements, wherever they appear, instead of the first 'given' element in each individual context like in XPath. This can be achieved by '//name/given[1]'
 * @param {string} path The path to evaluate
 * @param {Object} jml The JML object to evaluate the path on
 * @param {Object} [options] The evaluation options
 * @param {Object[]} [options.namespaces] An array of namespace objects
 * @param {string} [options.namespaces[].prefix] The namespace's prefix
 * @param {string} options.namespaces[].uri The namespace's URI
 * @return {Object[]} Returns an array with all matching parts of the evaluated JML object.
 */
export default (path, jml, options = {}) => {
    if (!isString(path) || path === '/' || (path !== '' && !path.startsWith('/'))) throw new Error(`${JSON.stringify(path)} is not a valid path`);
    if (!hasContent(jml) || !Array.isArray(jml.elements)) return [];
    if (path === '') return [jml];
    const steps = getPathSteps(simplifyPath(path));
    const rootJmlFragment = jml.elements[0];
    const results = recursiveEvaluate(steps, rootJmlFragment.elements, rootJmlFragment.attributes, options.namespaces);
    return wrapResults(results);
};