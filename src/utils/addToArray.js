/**
 * Adds new items to the end of an array. Mutates the original array!
 * @param {Array} array The source array
 * @param {Array|*} newItems The new item(s) to add. Can be either an array or a single item
 */
export default (array, newItems = []) => {
    const toPush = Array.isArray(newItems) ? newItems : [newItems];
    const arrayLength = array.length;
    for (let i = 0; i < toPush.length; i++) {
        array[arrayLength + i] = toPush[i];
    }
};