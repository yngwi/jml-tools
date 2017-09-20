import {expect} from 'chai';

import findNamespace from '../../src/utils/findNamespace';

const namespaces = [
    {prefix: 'ns1', uri: 'http://example.com/ns/1'},
    {prefix: 'ns2', uri: 'http://example.com/ns/2'},
];

describe('findNamespace', function () {

    it('should return undefined when called without arguments', () => {
        expect(findNamespace()).to.be.undefined;
    });

    it('should return undefined when called without a namespaces object', () => {
        expect(findNamespace('ns1')).to.be.undefined;
    });

    it('should return undefined when called with an invalid namespaces object', () => {
        expect(findNamespace('ns1', {some: 'object'})).to.be.undefined;
    });

    it('should return undefined when called with an empty url', () => {
        expect(findNamespace('', namespaces)).to.be.undefined;
    });

    it('should return undefined when called with an empty prefix', () => {
        expect(findNamespace('', namespaces, false)).to.be.undefined;
    });

    it('should return undefined when called with a prefix and without setting isUri to false', () => {
        expect(findNamespace('ns1', namespaces)).to.be.undefined;
    });

    it('should return undefined when called with an non-existing prefix', () => {
        expect(findNamespace('ns3', namespaces), false).to.be.undefined;
    });

    it('should return undefined when called with an non-existing URI', () => {
        expect(findNamespace('http://example.com/ns/3', namespaces)).to.be.undefined;
    });

    it('should return the correct namespace declaration for a prefix', () => {
        expect(findNamespace('ns1', namespaces, false)).to.deep.equal(namespaces[0]);
    });

    it('should return the correct namespace declaration for an URI', () => {
        expect(findNamespace('http://example.com/ns/2', namespaces)).to.deep.equal(namespaces[1]);
    });

});