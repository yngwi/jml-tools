import {expect} from 'chai';

import splitNamespaceName from '../../src/utils/splitNamespaceName';

describe('splitNamespaceName', function () {

    it('should return an empty object when called without arguments', () => {
        expect(splitNamespaceName()).to.deep.equal({});
    });

    it('should return an empty object when called with an empty string', () => {
        expect(splitNamespaceName('')).to.deep.equal({});
    });

    it('should throw an error when called with a non-string argument', () => {
        expect(() => splitNamespaceName({some: 'object'})).to.throw();
    });

    it('should return an object with the name', () => {
        expect(splitNamespaceName('example')).to.deep.equal({name: 'example'});
    });

    it('should return an object with prefix and name', () => {
        expect(splitNamespaceName('ns1:example')).to.deep.equal({prefix: 'ns1', name: 'example'});
    });

});