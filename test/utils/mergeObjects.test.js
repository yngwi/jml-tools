import {expect} from 'chai';

import mergeObjects from '../../src/utils/mergeObjects';

describe('mergeObjects', function () {

    it('should return an empty object when called without arguments', function () {
        expect(mergeObjects()).to.deep.equal({});
    });

    it('should return the first argument when called without only one argument', function () {
        expect(mergeObjects({one: 'one', two: 'two'})).to.deep.equal({one: 'one', two: 'two'});
    });

    it('should return the updated object', function () {
        expect(mergeObjects({one: 'one', two: 'two'}, {two: 'new', three: 'three'})).to.deep.equal({
            one: 'one',
            two: 'new',
            three: 'three',
        });
    });

});