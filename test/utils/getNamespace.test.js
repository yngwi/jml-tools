import {expect} from 'chai';
import getNamespace from '../../src/utils/getNamespace';


describe('getNamespace', function () {

    it('should return an empty object if called without arguments', function () {
        expect(getNamespace()).to.deep.equal({});
    });

    it('should return an empty object if called with an object that has no namespace data', function () {
        expect(getNamespace({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        })).to.deep.equal({});
    });

    it('should return the default namespace', function () {
        expect(getNamespace({
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
        })).to.deep.equal({'uri': 'http://example.com/ns'});
    });

    it('should return a prefixed namespace', function () {
        expect(getNamespace({
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
        })).to.deep.equal({'prefix': 'ex', 'uri': 'http://example.com/ns'});
    });

    it('should return a prefixed namespace from a fragment', function () {
        expect(getNamespace({
            'attributes': {
                'myAttribute': 'value',
                'xmlns:ex': 'http://example.com/ns',
            },
            'name': 'empty',
            'type': 'element',
        })).to.deep.equal({'prefix': 'ex', 'uri': 'http://example.com/ns'});
    });

});