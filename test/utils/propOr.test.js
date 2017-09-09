import {expect} from 'chai';

import propOr from '../../src/utils/propOr';

const testObject = {one: 1, two: 2};

describe('propOr', function () {

    it('should return the property for an existing name', function () {
        expect(propOr(0, 'one', testObject)).to.equal(1);
    });

    it('should return the substitute for an not existing name', function () {
        expect(propOr(0, 'three', testObject)).to.equal(0);
    });

    it('should return the substitute for an invalid name argument', function () {
        expect(propOr(0, {}, testObject)).to.equal(0);
    });

    it('should return the substitute for empty source object', function () {
        expect(propOr(0, 'three', {})).to.equal(0);
    });

});