import extractNamespaces from '../utils/extractNamespaces';
import findNamespace from '../utils/findNamespace';
import findDefaultNamespaceUri from '../utils/findDefaultNamespaceUri';
import hasContent from '../utils/hasContent';
import isNil from '../utils/isNil';
import isString from '../utils/isString';
import propOr from '../utils/propOr';
import splitNamespaceName from '../utils/splitNamespaceName';
import pathOr from '../utils/pathOr';

const DESCENDANTS_SELECTOR = '%';
const POSITION_SELECTOR = '#';

const separateStepAndConditions = (stepWithConditions = '') => {
    const stepWithoutAttributeSelectors = stepWithConditions.split('@')[0];
    // eslint-disable-next-line no-useless-escape
    let conditions = stepWithoutAttributeSelectors.match(/\[[^\[]*\]/g);
    conditions = Array.isArray(conditions) ? conditions : [];
    let actualStep = stepWithoutAttributeSelectors;
    const cleanConditions = [];
    for (let i = 0; i < conditions.length; i++) {
        actualStep = actualStep.replace(conditions[i], '');
        // eslint-disable-next-line no-useless-escape
        cleanConditions.push(conditions[i].replace(/[\[\]]/g, ''));
    }
    return {
        step: actualStep.replace(DESCENDANTS_SELECTOR, '').replace(/#\d*/g, ''),
        conditions: cleanConditions,
    };
};

const getPathSteps = simplePath => {
    if (!hasContent(simplePath)) return [];
    // eslint-disable-next-line no-useless-escape
    let conditions = simplePath.match(/\[[^\[]*\]/g);
    conditions = conditions === null ? [] : conditions;
    for (let i = 0; i < conditions.length; i++) {
        simplePath = simplePath.replace(conditions[i], `§${i}`);
    }
    const rawSteps = simplePath.split('/');
    const steps = [];
    for (let i = 0; i < rawSteps.length; i++) {
        let step = rawSteps[i];
        for (let j = 0; j < conditions.length; j++) {
            step = step.replace(`§${j}`, conditions[j]);
        }
        if (step !== '') steps.push(step);
    }
    return steps;
};

const evaluate = (steps, jmlFragments = [], parentAttributes = {}, declaredNamespaces = []) => {
    if (!hasContent(steps)) {
        return [];
    } else {
        const currentStep = steps[0];
        const results = [];
        for (let i = 0; i < jmlFragments.length; i++) {
            const currentJmlFragment = jmlFragments[i];
            const mergedAttributes = Object.assign({...parentAttributes}, propOr({}, 'attributes', currentJmlFragment));
            if (matches(currentStep, currentJmlFragment, mergedAttributes, declaredNamespaces)) {
                if (currentStep.endsWith('text()')) {
                    results.push(currentJmlFragment.text);
                } else if (currentStep.includes('@')) {
                    const attributeName = currentStep.split('@')[1];
                    const attributeValue = pathOr(undefined, ['attributes', attributeName], currentJmlFragment);
                    if (!isNil(attributeValue)) results.push(attributeValue);
                } else if (steps.length === 1) {
                    results.push(hasContent(mergedAttributes)
                        ? updateNamespacesFromAttributes(currentJmlFragment, mergedAttributes)
                        : currentJmlFragment);
                }
                results.push(...evaluate(steps.slice(1), currentJmlFragment.elements, mergedAttributes, declaredNamespaces));
            }
            if (currentStep.startsWith(DESCENDANTS_SELECTOR) && hasContent(jmlFragments)) {
                results.push(...evaluate(steps, currentJmlFragment.elements, mergedAttributes, declaredNamespaces));
            }
        }
        return results;
    }
};

// tests whether or not a JML fragment matches a step including namespace and conditions
const matches = (completeStep, jmlFragment, activeAttributes = {}, declaredNamespaces = []) => {
    const {step, conditions} = separateStepAndConditions(completeStep);
    const isMatchingStep = matchesStep(step, jmlFragment, activeAttributes, declaredNamespaces);
    const isMatchingConditions = matchesConditions(step, conditions, jmlFragment);
    return isMatchingStep && isMatchingConditions;
};

const matchesConditions = (step, conditions, jmlFragment) => {
    if (!hasContent(conditions)) return true;
    // TODO weitermachen
};

// test whether or not a fragment matches a qualified name
const matchesStep = (name, jmlFragment, activeAttributes, declaredNamespaces) => {
    if (name === 'text()' || name === '*') return true;
    const activeNamespaces = extractNamespaces(activeAttributes);
    const fragmentDefaultUri = findDefaultNamespaceUri(activeNamespaces);
    const {prefix: fragmentPrefix, name: fragmentName} = splitNamespaceName(jmlFragment.name);
    if (!hasContent(activeNamespaces) || isNil(fragmentDefaultUri) && isNil(fragmentPrefix)) {
        return fragmentName === name;
    } else if (name.startsWith('*:')) {
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

const simplifyPath = (path = '') => {
    let simplePath = path.replace(/\/\//g, `/${DESCENDANTS_SELECTOR}`).replace(/\/@/g, '@');
    const positionSelectors = simplePath.match(/\[\d*\]/g);
    if (hasContent(positionSelectors)) {
        for (let i = 0; i < positionSelectors.length; i++) {
            const selector = positionSelectors[i];
            // eslint-disable-next-line no-useless-escape
            const number = selector.replace(/[\[\]]/g, '');
            simplePath = simplePath.replace(selector, `${POSITION_SELECTOR}${number}`);
        }
    }
    return simplePath;
};

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

const wrapResults = (results = []) => {
    const wrapped = [];
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (isString(result)) {
            wrapped.push(result);
        } else if (hasContent(result)) {
            wrapped.push({elements: [result]});
        }
    }
    return wrapped;
};

/**
 * Evaluates a path. A difference to XPath is that the value of an attribute can be accessed directly by /something/@attribute instead of data(/something/@attribute) or /something/@attribute/string()
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
    const steps = getPathSteps(simplifyPath(path));
    const rootJmlFragment = jml.elements[0];
    const results = hasContent(steps)
        ? evaluate(steps, rootJmlFragment.elements, rootJmlFragment.attributes, options.namespaces)
        : [rootJmlFragment];
    return wrapResults(results);
};