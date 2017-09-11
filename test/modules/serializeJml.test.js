import {expect} from 'chai';

import serializeJml from '../../src/modules/serializeJml';

describe('serializeJml', function () {

    it('should return an empty string when called without arguments', function () {
        expect(serializeJml()).to.equal('');
    });

    it('should return an empty string when not provided with a mapping function', () => {
        expect(serializeJml(paragraphs)).to.equal('');
    });

    it('should return an output string when called with a mappings object', function () {
        expect(serializeJml(paragraphs, {
            paragraph: 'p',
            emph: 'i',
            bold: 'strong',
        })).to.equal('<p>This <i>should be <strong>a</strong> complete</i> sentence.</p>');
    });

    it('should return the modified output string when called with a mappings object that has a modification function', () => {
        expect(serializeJml(paragraphs, {
            paragraph: 'p',
            emph: ({content, attributes}) => `<i style="${attributes.style}">${content}</i>`,
            bold: 'strong',
        })).to.equal('<p>This <i style="italics">should be <strong>a</strong> complete</i> sentence.</p>');
    });

    it('should return the output string with one object missing if the mappings object omits the mapping for this object', () => {
        expect(serializeJml(paragraphs, {
            paragraph: 'p',
            emph: 'i',
        })).to.equal('<p>This <i>should be  complete</i> sentence.</p>');
    });

    it('should throw an error due to the missing namespace prefix on one of the mapped namespaces', () => {
        expect(
            () => serializeJml(paragraphsWithNamespaces, {'ns:paragraph': 'p'}, {namespaces: [{uri: 'http://example.com/ns'}]}),
        ).to.throw();
    });

    it('should return the output string for both objects irregardless of their namespace prefix; link needs to be missing due to the missing prefix', () => {
        expect(serializeJml(paragraphsWithNamespaces, {
            'ns:paragraph': 'p',
            'bold': 'b',
            'ns:emph': 'e',
            'ns:underline': 'u',
            'an:strike': 's',
            'an:link': 'l',
            '*': 'w',
        }, {
            namespaces: [
                {prefix: 'ns', uri: 'http://example.com/ns'},
                {prefix: 'an', uri: 'http://example.com/another'},
            ],
        })).to.equal('<p>This <b>should</b> be <e>a <u>complete</u> and nice <s>sentence</s></e>, with <w>many</w> a <l>different</l> part.</p>');
    });

    it('should return the only the text content', () => {
        expect(serializeJml(paragraphsWithNamespaces, ({content}) => content)).to.equal('This should be a complete and nice sentence, with many a different part.');
    });

    it('should return the output transformed by the provided transformation function', () => {
        expect(serializeJml(paragraphs, ({content, name}) => `<span data-name="${name}">${content}</span>`,
        )).to.equal('<span data-name="paragraph">This <span data-name="emph">should be <span data-name="bold">a</span> complete</span> sentence.</span>');
    });

    it('should return a string that skips the empty object and can be serialized into valid json', () => {
        const serialized = serializeJml(persons, {
            persons: ({content}) => `{"persons": [${content.replace(/(,$)/g, '')}]}`,
            person: ({content, attributes}) => `{"person": {"name": "${content}", ${Object.keys(attributes).map(key => `"${key}": "${attributes[key]}"`)}}},`,
        }, {skipEmpty: true});
        expect(JSON.parse(serialized)).to.deep.equal({
            'persons': [
                {
                    'person': {
                        'birth': '1946-09-05',
                        'name': 'Freddie Mercury',
                    },
                },
                {
                    'person': {
                        'birth': '1947-07-19',
                        'name': 'Brian May',
                    },
                },
            ],
        });
    });

});

const paragraphs = {
    elements: [{
        'type': 'element',
        'name': 'paragraph',
        'elements': [
            {'type': 'text', 'text': 'This '},
            {
                'type': 'element',
                'name': 'emph',
                'attributes': {
                    'style': 'italics',
                },
                'elements': [
                    {'type': 'text', 'text': 'should be '},
                    {
                        'type': 'element',
                        'name': 'bold',
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

const paragraphsWithNamespaces = {
    'elements': [{
        'type': 'element',
        'name': 'ns:paragraph',
        'attributes': {'xmlns:ns': 'http://example.com/ns', 'xmlns:an': 'http://example.com/another'},
        'elements': [{'type': 'text', 'text': 'This '}, {
            'type': 'element',
            'name': 'bold',
            'elements': [{'type': 'text', 'text': 'should'}],
        }, {'type': 'text', 'text': ' be '}, {
            'type': 'element',
            'name': 'emph',
            'attributes': {'xmlns': 'http://example.com/ns'},
            'elements': [{'type': 'text', 'text': 'a '}, {
                'type': 'element',
                'name': 'underline',
                'elements': [{'type': 'text', 'text': 'complete'}],
            }, {'type': 'text', 'text': ' and nice '}, {
                'type': 'element',
                'name': 'strike',
                'attributes': {'xmlns': 'http://example.com/another'},
                'elements': [{'type': 'text', 'text': 'sentence'}],
            }],
        }, {'type': 'text', 'text': ', with '}, {
            'type': 'element',
            'name': 'an:stuff',
            'elements': [{'type': 'text', 'text': 'many'}],
        }, {'type': 'text', 'text': ' a '}, {
            'type': 'element',
            'name': 'an:link',
            'elements': [{'type': 'text', 'text': 'different'}],
        }, {'type': 'text', 'text': ' part.'}],
    }],
};

const persons = {
    elements: [{
        'type': 'element',
        'name': 'persons',
        'elements': [
            {
                'type': 'element',
                'name': 'person',
                'attributes': {birth: '1946-09-05'},
                'elements': [
                    {'type': 'text', 'text': 'Freddie Mercury'},
                ],
            },
            {
                'type': 'element',
                'name': 'person',
                'attributes': {birth: '1947-07-19'},
                'elements': [
                    {'type': 'text', 'text': 'Brian May'},
                ],
            },
            {
                'type': 'element',
                'name': 'person',
            },
        ],
    }],
};