import {expect} from 'chai';

import walkTree from '../../src/utils/walkTree';

describe('walkTree', function () {

    it('should do nothing when not provided with no data', function () {
        const result = [];
        walkTree();
        expect(result).to.deep.equal([]);
    });

    it('should do nothing when not provided with a callback function', function () {
        const result = [];
        walkTree(paragraphsWithNamespaces);
        expect(result).to.deep.equal([]);
    });

    it('should produce the correct payloads for each tree step', function () {
        const result = [];
        walkTree(paragraphsWithNamespaces, payload => result.push(payload));
        expect(result).to.deep.equal(expectedPayload);
    });

});

const paragraphsWithNamespaces = {
    elements: [{
        'type': 'element',
        'name': 'paragraph',
        'attributes': {
            'xmlns': 'http://example.com/ns',
            'xmlns:ns': 'http://example.com/ns',
        },
        'elements': [
            {'type': 'text', 'text': 'This '},
            {
                'type': 'element',
                'name': 'ns:emph',
                'attributes': {
                    'style': 'italics',
                },
                'elements': [
                    {'type': 'text', 'text': 'should be '},
                    {
                        'type': 'element',
                        'name': 'bold',
                        'attributes': {
                            'xmlns': 'http://example.com/another',
                        },
                        'elements': [
                            {'type': 'text', 'text': 'a'},
                        ],
                    },
                    {'type': 'text', 'text': ' complete'},
                ],
            },
            {'type': 'text', 'text': ' sentence.'},
        ],
    }],
};

const expectedPayload = [
    {
        'jml':
            {
                'type': 'text',
                'text': 'This ',
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'paragraph',
                        'attributes':
                            {
                                'xmlns': 'http://example.com/ns',
                                'xmlns:ns': 'http://example.com/ns',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'This ',
                            },
                            {
                                'type': 'element',
                                'name': 'ns:emph',
                                'attributes':
                                    {
                                        'style': 'italics',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'should be ',
                                    },
                                    {
                                        'type': 'element',
                                        'name': 'bold',
                                        'attributes':
                                            {
                                                'xmlns': 'http://example.com/another',
                                            },
                                        'elements': [
                                            {
                                                'type': 'text',
                                                'text': 'a',
                                            },
                                        ],
                                    },
                                    {
                                        'type': 'text',
                                        'text': ' complete',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' sentence.',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'text',
                'text': 'should be ',
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'ns:emph',
                        'attributes':
                            {
                                'style': 'italics',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'should be ',
                            },
                            {
                                'type': 'element',
                                'name': 'bold',
                                'attributes':
                                    {
                                        'xmlns': 'http://example.com/another',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'a',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' complete',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'text',
                'text': 'a',
            },
        'namespaces': [
            {
                'uri': 'http://example.com/another',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'bold',
                        'attributes':
                            {
                                'xmlns': 'http://example.com/another',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'a',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/another',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'element',
                'name': 'bold',
                'attributes':
                    {
                        'xmlns': 'http://example.com/another',
                    },
                'elements': [
                    {
                        'type': 'text',
                        'text': 'a',
                    },
                ],
            },
        'namespaces': [
            {
                'uri': 'http://example.com/another',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'ns:emph',
                        'attributes':
                            {
                                'style': 'italics',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'should be ',
                            },
                            {
                                'type': 'element',
                                'name': 'bold',
                                'attributes':
                                    {
                                        'xmlns': 'http://example.com/another',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'a',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' complete',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'text',
                'text': ' complete',
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'ns:emph',
                        'attributes':
                            {
                                'style': 'italics',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'should be ',
                            },
                            {
                                'type': 'element',
                                'name': 'bold',
                                'attributes':
                                    {
                                        'xmlns': 'http://example.com/another',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'a',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' complete',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'element',
                'name': 'ns:emph',
                'attributes':
                    {
                        'style': 'italics',
                    },
                'elements': [
                    {
                        'type': 'text',
                        'text': 'should be ',
                    },
                    {
                        'type': 'element',
                        'name': 'bold',
                        'attributes':
                            {
                                'xmlns': 'http://example.com/another',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'a',
                            },
                        ],
                    },
                    {
                        'type': 'text',
                        'text': ' complete',
                    },
                ],
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'paragraph',
                        'attributes':
                            {
                                'xmlns': 'http://example.com/ns',
                                'xmlns:ns': 'http://example.com/ns',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'This ',
                            },
                            {
                                'type': 'element',
                                'name': 'ns:emph',
                                'attributes':
                                    {
                                        'style': 'italics',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'should be ',
                                    },
                                    {
                                        'type': 'element',
                                        'name': 'bold',
                                        'attributes':
                                            {
                                                'xmlns': 'http://example.com/another',
                                            },
                                        'elements': [
                                            {
                                                'type': 'text',
                                                'text': 'a',
                                            },
                                        ],
                                    },
                                    {
                                        'type': 'text',
                                        'text': ' complete',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' sentence.',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'text',
                'text': ' sentence.',
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
        'parent':
            {
                'jml':
                    {
                        'type': 'element',
                        'name': 'paragraph',
                        'attributes':
                            {
                                'xmlns': 'http://example.com/ns',
                                'xmlns:ns': 'http://example.com/ns',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'This ',
                            },
                            {
                                'type': 'element',
                                'name': 'ns:emph',
                                'attributes':
                                    {
                                        'style': 'italics',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'should be ',
                                    },
                                    {
                                        'type': 'element',
                                        'name': 'bold',
                                        'attributes':
                                            {
                                                'xmlns': 'http://example.com/another',
                                            },
                                        'elements': [
                                            {
                                                'type': 'text',
                                                'text': 'a',
                                            },
                                        ],
                                    },
                                    {
                                        'type': 'text',
                                        'text': ' complete',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' sentence.',
                            },
                        ],
                    },
                'namespaces': [
                    {
                        'uri': 'http://example.com/ns',
                    },
                    {
                        'prefix': 'ns',
                        'uri': 'http://example.com/ns',
                    },
                ],
            },
    },
    {
        'jml':
            {
                'type': 'element',
                'name': 'paragraph',
                'attributes':
                    {
                        'xmlns': 'http://example.com/ns',
                        'xmlns:ns': 'http://example.com/ns',
                    },
                'elements': [
                    {
                        'type': 'text',
                        'text': 'This ',
                    },
                    {
                        'type': 'element',
                        'name': 'ns:emph',
                        'attributes':
                            {
                                'style': 'italics',
                            },
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'should be ',
                            },
                            {
                                'type': 'element',
                                'name': 'bold',
                                'attributes':
                                    {
                                        'xmlns': 'http://example.com/another',
                                    },
                                'elements': [
                                    {
                                        'type': 'text',
                                        'text': 'a',
                                    },
                                ],
                            },
                            {
                                'type': 'text',
                                'text': ' complete',
                            },
                        ],
                    },
                    {
                        'type': 'text',
                        'text': ' sentence.',
                    },
                ],
            },
        'namespaces': [
            {
                'uri': 'http://example.com/ns',
            },
            {
                'prefix': 'ns',
                'uri': 'http://example.com/ns',
            },
        ],
    },
];