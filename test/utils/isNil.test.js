import {expect} from 'chai';

import isNil from '../../src/utils/isNil';

describe('isNil', function () {

    it('should return true when called without arguments', function () {
        expect(isNil()).to.be.true;
    });

    it('should return true when called with null', function () {
        expect(isNil(null)).to.be.true;
    });

    it('should return false when called with an object', function () {
        expect(isNil({})).to.be.false;
    });

});