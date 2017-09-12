import {expect} from 'chai';
import {js2xml} from 'xml-js';

import create from '../../src/modules/create';

describe('create', function () {

    it('should throw an error when called without arguments', function () {
        expect(() => create()).to.throw();
    });

    it('should create a JML object without child content when called with only a name', function () {
        expect(create('empty')).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object without child content when called with an empty object as content', function () {
        expect(create('empty', {content: {}})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object without child content when called with an empty array as content', function () {
        expect(create('empty', {content: []})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object without child content when called with an empty string as content', function () {
        expect(create('empty', {content: ''})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with a child text object when called with text content', function () {
        expect(create('person', {content: 'Freddie Mercury'})).to.deep.equal({
            'elements': [
                {
                    'elements': [
                        {
                            'text': 'Freddie Mercury',
                            'type': 'text',
                        },
                    ],
                    'name': 'person',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with a child element object when called with a child element', function () {
        expect(create('person', {
            content: {
                'elements': [
                    {
                        'name': 'address',
                        'type': 'element',
                    },
                ],
            },
        })).to.deep.equal({
            'elements': [
                {
                    'elements': [
                        {
                            'name': 'address',
                            'type': 'element',
                        },
                    ],
                    'name': 'person',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with two child element objects when called with two child elements', function () {
        expect(create('person', {
            content: [{
                'elements': [
                    {
                        'name': 'address',
                        'type': 'element',
                    },
                ],
            }, {
                'elements': [
                    {
                        'name': 'phone',
                        'type': 'element',
                    },
                ],
            }],
        })).to.deep.equal({
            'elements': [
                {
                    'elements': [
                        {
                            'name': 'address',
                            'type': 'element',
                        },
                        {
                            'name': 'phone',
                            'type': 'element',
                        },
                    ],
                    'name': 'person',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with attribute when called with an attribute object', function () {
        expect(create('empty', {attributes: {myAttribute: 'value'}})).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object without attributes for invalid attributes', function () {
        expect(create('empty', {attributes: {valid: 'value', invalid: {object: true}}})).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'valid': 'value',
                        // eslint-disable-next-line no-useless-escape
                        'invalid': '{\"object\":true}',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with an prefix-less namespace attribute when called with a namespace uri', function () {
        expect(create('empty', {namespaces: [{uri: 'http://example.com/ns'}]})).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'xmlns': 'http://example.com/ns',
                    },
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with an a prefixed name and namespace attribute when called with namespace prefix and uri', function () {
        expect(create('ex:empty', {namespaces: [{prefix: 'ex', uri: 'http://example.com/ns'}]})).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'xmlns:ex': 'http://example.com/ns',
                    },
                    'name': 'ex:empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with a merged attributes object when called with a namespace and attributes', function () {
        expect(create('ex:empty', {
            namespaces: [{prefix: 'ex', uri: 'http://example.com/ns'}],
            attributes: {myAttribute: 'value'},
        })).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                        'xmlns:ex': 'http://example.com/ns',
                    },
                    'name': 'ex:empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create a JML object with two namespaces and nested elements in different namespaces', function () {
        expect(create('root', {
            namespaces: [{uri: 'http://example.com/default'}, {prefix: 'ex', uri: 'http://example.com/ns'}],
            attributes: {myAttribute: 'value'},
            content: create('ex:child'),
        })).to.deep.equal({
            'elements': [
                {
                    'attributes': {
                        'myAttribute': 'value',
                        'xmlns': 'http://example.com/default',
                        'xmlns:ex': 'http://example.com/ns',
                    },
                    'elements': [
                        {
                            'name': 'ex:child',
                            'type': 'element',
                        },
                    ],
                    'name': 'root',
                    'type': 'element',
                },
            ],
        });
    });

    it('should be return the correct xml string when converted with xml-js', function () {
        const jmlObject = create('ex:person', {
            content: 'Freddie Mercury',
            namespaces: [{prefix: 'ex', uri: 'http://example.com/ns'}],
            attributes: {birth: '1946-09-05'},
        });
        expect(js2xml(jmlObject, {compact: false})).to.equal('<ex:person xmlns:ex="http://example.com/ns" birth="1946-09-05">Freddie Mercury</ex:person>');
    });

});