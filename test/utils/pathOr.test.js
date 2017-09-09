import {expect} from 'chai';

import pathOr from '../../src/utils/pathOr';

const testObject = {path: {to: {value: 1, other: 2}}};

describe('pathOr', function () {

    it('should return the whole object for an empty path', function () {
        expect(pathOr(0, [], testObject)).to.deep.equal(testObject);
    });

    it('should return the sub-object for an existing path', function () {
        expect(pathOr(0, ['path', 'to', 'value'], testObject)).to.equal(1);
    });

    it('should return the substitute for an empty object', function () {
        expect(pathOr(0, ['path', 'to', 'another', 'value'], {})).to.equal(0);
    });

    it('should return the substitute for a wrong path', function () {
        expect(pathOr(0, ['path', 'to', 'another', 'value'], testObject)).to.equal(0);
    });

    it('should return the substitute for a path that is not an array', function () {
        expect(pathOr(0, {}, testObject)).to.equal(0);
    });

});