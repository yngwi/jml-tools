import {expect} from 'chai';

import rejectEmpty from '../../src/utils/rejectEmpty';

describe('rejectEmpty', function () {

    it('should return an empty array if called without arguments', function () {
        expect(rejectEmpty()).to.deep.equal([]);
    });

    it('should return an empty array if called with a non-array parameter', function () {
        expect(rejectEmpty('string')).to.deep.equal([]);
    });

    it('should return only non-empty items', function () {
        expect(rejectEmpty(['something', {a: 'b'}, [1, 2], {}, '', []])).to.deep.equal(['something', {a: 'b'}, [1, 2]]);
    });

});