import {expect} from 'chai';

import hasContent from '../../src/utils/hasContent';

describe('hasContent', function () {

    it('should return true when called with an non-empty string', function () {
        expect(hasContent('string')).to.be.true;
    });

    it('should return true when called with an number', function () {
        expect(hasContent(1)).to.be.true;
    });

    it('should return true when called with an non-empty object', function () {
        expect(hasContent({key: 'value'})).to.be.true;
    });

    it('should return true when called with an non-empty array', function () {
        expect(hasContent(['value'])).to.be.true;
    });

    it('should return false when called without arguments', function () {
        expect(hasContent()).to.be.false;
    });

    it('should return false when called with null', function () {
        expect(hasContent(null)).to.be.false;
    });

    it('should return false when called with nan', function () {
        expect(hasContent(NaN)).to.be.false;
    });

    it('should return false when called with an empty string', function () {
        expect(hasContent('')).to.be.false;
    });

    it('should return false when called with an empty object', function () {
        expect(hasContent({})).to.be.false;
    });

    it('should return false when called with an empty array', function () {
        expect(hasContent([])).to.be.false;
    });

});