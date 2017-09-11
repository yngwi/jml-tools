import {expect} from 'chai';

import extractNamespaces from '../../src/utils/extractNamespaces';

describe('extractNamespaces', function () {

    it('should return an empty array if called without arguments', function () {
        expect(extractNamespaces()).to.deep.equal([]);
    });

    it('should return an empty array if called with an empty object', function () {
        expect(extractNamespaces({})).to.deep.equal([]);
    });

    it('should return an empty object if called with an object that has no namespace data', function () {
        expect(extractNamespaces({
            'myAttribute': 'value',
        })).to.deep.equal([]);
    });

    it('should return the default namespace', function () {
        expect(extractNamespaces({
            'myAttribute': 'value',
            'xmlns': 'http://example.com/ns',
        })).to.deep.equal([{'uri': 'http://example.com/ns'}]);
    });

    it('should return a prefixed namespace', function () {
        expect(extractNamespaces({
            'myAttribute': 'value',
            'xmlns:ex': 'http://example.com/ns',
        })).to.deep.equal([{'prefix': 'ex', 'uri': 'http://example.com/ns'}]);
    });

    it('should return a default and a prefixed namespace', function () {
        expect(extractNamespaces({
            'myAttribute': 'value',
            'xmlns': 'http://example.com/default',
            'xmlns:ns': 'http://example.com/ns',
        })).to.deep.equal([{'uri': 'http://example.com/default'}, {'prefix': 'ns', 'uri': 'http://example.com/ns'}]);
    });

});