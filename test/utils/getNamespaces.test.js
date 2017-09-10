import {expect} from 'chai';

import getNamespaces from '../../src/utils/getNamespaces';

describe('getNamespaces', function () {

    it('should return an empty array if called without arguments', function () {
        expect(getNamespaces()).to.deep.equal([]);
    });

    it('should return an empty array if called with an object that has no attributes', function () {
        expect(getNamespaces({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal([]);
    });

    it('should return an empty object if called with an object that has no namespace data', function () {
        expect(getNamespaces({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal([]);
    });

    it('should return the default namespace', function () {
        expect(getNamespaces({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                        'xmlns': 'http://example.com/ns',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal([{'uri': 'http://example.com/ns'}]);
    });

    it('should return a prefixed namespace', function () {
        expect(getNamespaces({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                        'xmlns:ex': 'http://example.com/ns',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal([{'prefix': 'ex', 'uri': 'http://example.com/ns'}]);
    });

    it('should return a default and a prefixed namespace', function () {
        expect(getNamespaces({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                        'xmlns': 'http://example.com/default',
                        'xmlns:ns': 'http://example.com/ns',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal([{'uri': 'http://example.com/default'}, {'prefix': 'ns', 'uri': 'http://example.com/ns'}]);
    });

    it('should return a prefixed namespace from a fragment', function () {
        expect(getNamespaces({
            'attributes': {
                'myAttribute': 'value',
                'xmlns:ex': 'http://example.com/ns',
            },
            'name': 'empty',
            'type': 'element',
        })).to.deep.equal([{'prefix': 'ex', 'uri': 'http://example.com/ns'}]);
    });

});