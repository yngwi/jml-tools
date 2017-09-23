import {expect} from 'chai';

import addToArray from '../../src/utils/addToArray';

describe('addToArray', function () {

    it('should return the original array when called without new items', function () {
        const array = [1, 2, 3];
        addToArray(array);
        expect(array).to.deep.equal([1, 2, 3]);
    });

    it('should return the updated array when adding a second array', function () {
        const array = [1, 2, 3];
        addToArray(array, [4, 5, '6']);
        expect(array).to.deep.equal([1, 2, 3, 4, 5, '6']);
    });

    it('should return the updated array when adding a single new value', function () {
        const array = [1, 2, 3];
        addToArray(array, '4');
        expect(array).to.deep.equal([1, 2, 3, '4']);
    });

});