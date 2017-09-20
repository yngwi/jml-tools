import {expect} from 'chai';

import findDefaultNamespaceUri from '../../src/utils/findDefaultNamespaceUri';

describe('findDefaultNamespaceUri', function () {

    it('should return undefined when called without arguments', () => {
        expect(findDefaultNamespaceUri()).to.be.undefined;
    });

    it('should return undefined when called with invalid arguments', () => {
        expect(findDefaultNamespaceUri({some: 'object'})).to.be.undefined;
    });

    it('should return undefined when no default namespace can be found', () => {
        expect(findDefaultNamespaceUri([{prefix: 'ns1', uri: 'http://example.com/ns/1'}])).to.be.undefined;
    });

    it('should return the correct namespace URI', () => {
        expect(findDefaultNamespaceUri([
            {prefix: 'ns1', uri: 'http://example.com/ns/1'},
            {uri: 'http://example.com/ns/default'},
            {uri: 'http://example.com/ns/another'},
        ])).to.equal('http://example.com/ns/default');
    });

});