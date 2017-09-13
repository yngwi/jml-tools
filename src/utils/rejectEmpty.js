import hasContent from './hasContent';

/**
 * Removes empty items from an array. Empty items are empty strings, arrays and objects.
 * @example
 * ['something', {a: 'b'}, [1, 2], {}, '', []] => ['something', {a: 'b'}, [1, 2]]
 * @param {Array} items The array to remove items from
 * @return {Array} Returns a new array only non-empty content.
 */
export default items => {
    if (!Array.isArray(items)) return [];
    const itemsWithContent = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (hasContent(item)) {
            itemsWithContent.push(item);
        }
    }
    return itemsWithContent;
};