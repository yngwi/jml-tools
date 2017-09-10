import {expect} from 'chai';
import {js2xml} from 'xml-js';

import createElement from '../../src/modules/createElement';

describe('createElement', function () {

    it('should throw an error when called without arguments', function () {
        expect(() => createElement()).to.throw();
    });

    it('should create an JML object without child content when called with only a name', function () {
        expect(createElement('empty')).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create an JML object without child content when called with an empty object as content', function () {
        expect(createElement('empty', {content: {}})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create an JML object without child content when called with an empty array as content', function () {
        expect(createElement('empty', {content: []})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create an JML object without child content when called with an empty string as content', function () {
        expect(createElement('empty', {content: ''})).to.deep.equal({
            'elements': [
                {
                    'name': 'empty',
                    'type': 'element',
                },
            ],
        });
    });

    it('should create an JML object with a child text object when called with text content', function () {
        expect(createElement('person', {content: 'Freddie Mercury'})).to.deep.equal({
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

    it('should create an JML object with a child element object when called with a child element', function () {
        expect(createElement('person', {
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

    it('should create an JML object with two child element objects when called with two child elements', function () {
        expect(createElement('person', {
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

    it('should create an JML object with attribute when called with an attribute object', function () {
        expect(createElement('empty', {attributes: {myAttribute: 'value'}})).to.deep.equal({
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

    it('should create an JML object without attributes for invalid attributes', function () {
        expect(createElement('empty', {attributes: {valid: 'value', invalid: {object: true}}})).to.deep.equal({
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

    it('should create an JML object with an prefix-less namespace attribute when called with a namespace uri', function () {
        expect(createElement('empty', {namespace: {uri: 'http://example.com/ns'}})).to.deep.equal({
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

    it('should create an JML object with an a prefixed name and namespace attribute when called with namespace prefix and uri', function () {
        expect(createElement('empty', {namespace: {prefix: 'ex', uri: 'http://example.com/ns'}})).to.deep.equal({
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

    it('should create an JML object with a merged attributes object when called with a namespace and attributes', function () {
        expect(createElement('empty', {
            namespace: {prefix: 'ex', uri: 'http://example.com/ns'},
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

    it('should be return the correct xml string when converted with xml-js', function () {
        const jmlObject = createElement('person', {
            content: 'Freddie Mercury',
            namespace: {prefix: 'ex', uri: 'http://example.com/ns'},
            attributes: {birth: '1946-09-05'},
        });
        expect(js2xml(jmlObject, {compact: false})).to.equal('<ex:person xmlns:ex="http://example.com/ns" birth="1946-09-05">Freddie Mercury</ex:person>');
    });

});