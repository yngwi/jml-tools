import {expect} from 'chai';

import isString from '../../src/utils/isString';

describe('isString', function () {

    it('should return false when called without arguments', function () {
        expect(isString()).to.be.false;
    });

    it('should return true when called with a string', function () {
        expect(isString('string')).to.be.true;
    });

    it('should return false when called with an object', function () {
        expect(isString({})).to.be.false;
    });

});