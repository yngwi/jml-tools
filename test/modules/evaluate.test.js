import {expect} from 'chai';
import evaluate from '../../src/modules/evaluate';

describe('evaluate', function () {

    // Throw errors

    it('should throw an error if called without arguments', function () {
        expect(() => evaluate()).to.throw();
    });

    it('should throw an error when called with a path that is not a string', function () {
        expect(() => evaluate({}, jmlObject)).to.throw();
    });

    it('should throw an error due to / not being a valid path', function () {
        expect(() => evaluate('/', jmlObject)).to.throw();
    });

    it('should throw an error due to planets/inner without leading / not being a valid path', function () {
        expect(() => evaluate('planets/inner', jmlObject)).to.throw();
    });

    it('should throw an error due to an invalid namespace declaration because a used prefix is missing', function () {
        expect(() => evaluate('/ns1:persons', jmlObject, {
            namespaces: [{uri: 'http://example.com/ns/1'}, {prefix: 'ns2', uri: 'http://example.com/ns/2'}],
        })).to.throw();
    });

    // empty result sets

    it('should return an empty array when called without an JML object', function () {
        expect(evaluate('', undefined)).to.deep.equal([]);
    });

    it('should return an empty array when called with an invalid JML object', function () {
        expect(evaluate('', {some: 'object'})).to.deep.equal([]);
    });

    it('should return an empty array when called with an unused namespace', function () {
        expect(evaluate('/ns1:planets', jmlObject, options)).to.deep.equal([]); // "planets" doesn't have a namespace
    });

    it('should return an empty array when called with the wrong namespace', function () {
        expect(evaluate('/ns2:persons', jmlObject, options)).to.deep.equal([]); // "persons" is in the "ns1" namespace
    });

    it('should return an empty array when called with the wrong namespace for an object in the default namespace', function () {
        expect(evaluate('/persons', jmlObject, options)).to.deep.equal([]); // "persons" is in the "ns1" namespace
    });

    it('should return an empty array when called with a non-existing path', function () {
        expect(evaluate('/ns1:person', jmlObject, options)).to.deep.equal([]); // ns1:person is no child of root
    });

    it('should return an empty array when having a typo in the path', function () {
        expect(evaluate('//ns1:person[@birt="1947-07-19"]', jmlObject, options)).to.deep.equal([]); // it's "birth" not "birt"
    });

    it('should return an empty array when missing () from text()', function () {
        expect(evaluate('//ns1:first/text', jmlObject, options)).to.deep.equal([]); // "text" instead of "text()" is considered an object instead of the text node
    });

    // non-empty result sets

    it('should return the whole object as the single result when called with a an empty string as path', function () {
        expect(evaluate('', jmlObject, options)).to.deep.equal([jmlObject]);
    });

    it('should return the correct result for /inner', function () {
        expect(evaluate('/inner', simple)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'inner',
                'elements': [{'type': 'text', 'text': 'some text'}],
            }],
        }]);
    });

    it('should return the correct result for /planets/inner/text()', function () {
        expect(evaluate('/planets/inner/text()', jmlObject, options)).to.deep.equal(['Earth', 'Mars']);
    });

    it('should return the correct result for /planets//text()', function () {
        expect(evaluate('/planets//text()', jmlObject, options)).to.deep.equal(['Earth', 'Mars']);
    });

    it('should return the correct result for /ns1:persons/ns1:person', function () {
        expect(evaluate('/ns1:persons/ns1:person', jmlObject, options)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'person',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                    'birth': '1946-09-05',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'ns1:first',
                        'elements': [{'type': 'text', 'text': 'Freddie'}],
                    }, {'type': 'element', 'name': 'ns1:last', 'elements': [{'type': 'text', 'text': 'Mercury'}]}],
                }, {
                    'type': 'element',
                    'name': 'address',
                    'attributes': {'xmlns': 'http://example.com/2'},
                    'elements': [{
                        'type': 'element',
                        'name': 'street',
                        'elements': [{'type': 'text', 'text': 'Fake street'}],
                    }, {
                        'type': 'element',
                        'name': 'ns2:number',
                        'elements': [{'type': 'text', 'text': '123'}],
                    }, {'type': 'element', 'name': 'ns2:city', 'elements': [{'type': 'text', 'text': 'London'}]}],
                }],
            }],
        }, {
            'elements': [{
                'type': 'element',
                'name': 'ns1:person',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                    'birth': '1947-07-19',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'first',
                        'elements': [{'type': 'text', 'text': 'Brian'}],
                    }, {'type': 'element', 'name': 'last', 'elements': [{'type': 'text', 'text': 'May'}]}],
                }],
            }],
        }]);
    });

    it('should return the correct result for //ns1:person', function () {
        expect(evaluate('//ns1:person', jmlObject, options)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'person',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                    'birth': '1946-09-05',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'ns1:first',
                        'elements': [{'type': 'text', 'text': 'Freddie'}],
                    }, {'type': 'element', 'name': 'ns1:last', 'elements': [{'type': 'text', 'text': 'Mercury'}]}],
                }, {
                    'type': 'element',
                    'name': 'address',
                    'attributes': {'xmlns': 'http://example.com/2'},
                    'elements': [{
                        'type': 'element',
                        'name': 'street',
                        'elements': [{'type': 'text', 'text': 'Fake street'}],
                    }, {
                        'type': 'element',
                        'name': 'ns2:number',
                        'elements': [{'type': 'text', 'text': '123'}],
                    }, {'type': 'element', 'name': 'ns2:city', 'elements': [{'type': 'text', 'text': 'London'}]}],
                }],
            }],
        }, {
            'elements': [{
                'type': 'element',
                'name': 'ns1:person',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                    'birth': '1947-07-19',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'first',
                        'elements': [{'type': 'text', 'text': 'Brian'}],
                    }, {'type': 'element', 'name': 'last', 'elements': [{'type': 'text', 'text': 'May'}]}],
                }],
            }],
        }]);
    });

    it('should return the correct result for //ns1:name', function () {
        expect(evaluate('//ns1:name', jmlObject, options)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'ns1:name',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:first',
                    'elements': [{'type': 'text', 'text': 'Freddie'}],
                }, {'type': 'element', 'name': 'ns1:last', 'elements': [{'type': 'text', 'text': 'Mercury'}]}],
            }],
        }, {
            'elements': [{
                'type': 'element',
                'name': 'ns1:name',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'first',
                    'elements': [{'type': 'text', 'text': 'Brian'}],
                }, {'type': 'element', 'name': 'last', 'elements': [{'type': 'text', 'text': 'May'}]}],
            }],
        }]);
    });

    it('should return the correct result for //ns2:name', function () {
        expect(evaluate('//ns2:name', jmlObject, options)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'ns2:name',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                },
                'elements': [{'type': 'text', 'text': 'Last address'}],
            }],
        }]);
    });

    it('should return the correct result for //*:name//text()', function () {
        expect(evaluate('//*:name//text()', jmlObject, options)).to.deep.equal(['Freddie', 'Mercury', 'Brian', 'May', 'Last address']);
    });

    it('should return the correct result for //ns1:person/@birth', function () {
        expect(evaluate('//ns1:person/@birth', jmlObject, options)).to.deep.equal(['1946-09-05', '1947-07-19']);
    });

    it('should return the correct result for //ns1:person//ns1:name/ns1:first', function () {
        expect(evaluate('//ns1:person//ns1:name/ns1:first', jmlObject, options)).to.deep.equal([{
            'elements': [{
                'type': 'element',
                'name': 'ns1:first',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                },
                'elements': [{'type': 'text', 'text': 'Freddie'}],
            }],
        }, {
            'elements': [{
                'type': 'element',
                'name': 'first',
                'attributes': {
                    'xmlns': 'http://example.com/ns/1',
                    'xmlns:ns2': 'http://example.com/ns/2',
                    'xmlns:ns1': 'http://example.com/ns/1',
                },
                'elements': [{'type': 'text', 'text': 'Brian'}],
            }],
        }]);
    });

    it('should return the correct result for //ns1:person[1]//ns1:first//text()', function () {
        expect(evaluate('//ns1:person[1]//ns1:first//text()', jmlObject, options)).to.deep.equal(['Freddie']);
    });

    it('should return the correct result for //ns1:first[1]/text()', function () {
        expect(evaluate('//ns1:first[1]/text()', jmlObject, options)).to.deep.equal(['Freddie']);
    });

    it('should return the correct result for //ns1:name/ns1:first[1]/text()', function () {
        expect(evaluate('//ns1:name/ns1:first[1]/text()', jmlObject, options)).to.deep.equal(['Freddie', 'Brian']);
    });

    it('should return the correct result for //ns1:person[@birth="1947-07-19"]//ns1:first/text()', function () {
        expect(evaluate('//ns1:person[@birth="1947-07-19"]//ns1:first/text()', jmlObject, options)).to.deep.equal(['Brian']);
    });

    it('should return the correct result for //ns1:person[@birth!="1947-07-19"]//ns1:first/text()', function () {
        expect(evaluate('//ns1:person[@birth!="1947-07-19"]//ns1:first/text()', jmlObject, options)).to.deep.equal(['Freddie']);
    });

    it('should return the correct result for //ns1:name/*/text()', function () {
        expect(evaluate('//ns1:name/*/text()', jmlObject, options)).to.deep.equal(['Freddie', 'Mercury', 'Brian', 'May']);
    });

    it('should return the correct result for //ns1:person[.//ns1:last/text()="May"][1]//ns1:first/text()', function () {
        expect(evaluate('//ns1:person[.//ns1:last/text()="May"][1]//ns1:first/text()', jmlObject, options)).to.deep.equal(['Brian']);
    });

});

const options = {
    namespaces: [
        {prefix: 'ns1', uri: 'http://example.com/ns/1'},
        {prefix: 'ns2', uri: 'http://example.com/ns/2'},
    ],
};

// <outer><inner>some text</inner></outer>
const simple = {
    'elements': [{
        'type': 'element',
        'name': 'outer',
        'elements': [{'type': 'element', 'name': 'inner', 'elements': [{'type': 'text', 'text': 'some text'}]}],
    }],
};

/* <root
    xmlns:ns1="http://example.com/ns/1"
    xmlns:ns2="http://example.com/ns/2">
    <planets>
        <inner>Earth</inner>
        <inner>Mars</inner>
    </planets>
    <ns1:persons
        xmlns="http://example.com/ns/1">
        <person
            birth="1946-09-05">
            <ns1:name>
                <ns1:first>Freddie</ns1:first>
                <ns1:last>Mercury</ns1:last>
            </ns1:name>
            <address
                xmlns="http://example.com/2">
                <street>Fake street</street>
                <ns2:number>123</ns2:number>
                <ns2:city>London</ns2:city>
            </address>
        </person>
        <ns1:person
            birth="1947-07-19">
            <ns1:name>
                <first>Brian</first>
                <last>May</last>
            </ns1:name>
        </ns1:person>
    </ns1:persons>
    <ns2:places
        xmlns="http://example.com/ns/1">
        <ns2:place>
            <ns2:name>Last address</ns2:name>
            <address
                xmlns="http://example.com/2">
                <street>Another street</street>
                <ns2:number>4712</ns2:number>
                <ns2:city>Brighton</ns2:city>
            </address>
        </ns2:place>
    </ns2:places>
</root> */
const jmlObject = {
    'elements': [{
        'type': 'element',
        'name': 'root',
        'attributes': {
            'xmlns:ns1': 'http://example.com/ns/1',
            'xmlns:ns2': 'http://example.com/ns/2',
        },
        'elements': [{
            'type': 'element',
            'name': 'planets',
            'elements': [{
                'type': 'element',
                'name': 'inner',
                'elements': [{
                    'type': 'text',
                    'text': 'Earth',
                }],
            }, {
                'type': 'element',
                'name': 'inner',
                'elements': [{
                    'type': 'text',
                    'text': 'Mars',
                }],
            }],
        }, {
            'type': 'element',
            'name': 'ns1:persons',
            'attributes': {
                'xmlns': 'http://example.com/ns/1',
            },
            'elements': [{
                'type': 'element',
                'name': 'person',
                'attributes': {
                    'birth': '1946-09-05',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'ns1:first',
                        'elements': [{
                            'type': 'text',
                            'text': 'Freddie',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'ns1:last',
                        'elements': [{
                            'type': 'text',
                            'text': 'Mercury',
                        }],
                    }],
                }, {
                    'type': 'element',
                    'name': 'address',
                    'attributes': {
                        'xmlns': 'http://example.com/2',
                    },
                    'elements': [{
                        'type': 'element',
                        'name': 'street',
                        'elements': [{
                            'type': 'text',
                            'text': 'Fake street',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'ns2:number',
                        'elements': [{
                            'type': 'text',
                            'text': '123',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'ns2:city',
                        'elements': [{
                            'type': 'text',
                            'text': 'London',
                        }],
                    }],
                }],
            }, {
                'type': 'element',
                'name': 'ns1:person',
                'attributes': {
                    'birth': '1947-07-19',
                },
                'elements': [{
                    'type': 'element',
                    'name': 'ns1:name',
                    'elements': [{
                        'type': 'element',
                        'name': 'first',
                        'elements': [{
                            'type': 'text',
                            'text': 'Brian',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'last',
                        'elements': [{
                            'type': 'text',
                            'text': 'May',
                        }],
                    }],
                }],
            }],
        }, {
            'type': 'element',
            'name': 'ns2:places',
            'attributes': {
                'xmlns': 'http://example.com/ns/1',
            },
            'elements': [{
                'type': 'element',
                'name': 'ns2:place',
                'elements': [{
                    'type': 'element',
                    'name': 'ns2:name',
                    'elements': [{
                        'type': 'text',
                        'text': 'Last address',
                    }],
                }, {
                    'type': 'element',
                    'name': 'address',
                    'attributes': {
                        'xmlns': 'http://example.com/2',
                    },
                    'elements': [{
                        'type': 'element',
                        'name': 'street',
                        'elements': [{
                            'type': 'text',
                            'text': 'Another street',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'ns2:number',
                        'elements': [{
                            'type': 'text',
                            'text': '4712',
                        }],
                    }, {
                        'type': 'element',
                        'name': 'ns2:city',
                        'elements': [{
                            'type': 'text',
                            'text': 'Brighton',
                        }],
                    }],
                }],
            }],
        }],
    }],
};