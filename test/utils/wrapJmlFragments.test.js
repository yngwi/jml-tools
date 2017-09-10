import {expect} from 'chai';

import wrapJmlFragments from '../../src/utils/wrapJmlFragments';

describe('wrapJmlFragments', function () {

    it('should return an empty array when called without arguments', function () {
        expect(wrapJmlFragments()).to.deep.equal([]);
    });

    it('should throw an error when called with a valid and an invalid fragment', function () {
        expect(() => wrapJmlFragments([{
            'name': 'person',
            'type': 'element',
        }, {
            'text': 'This ist some text',
            'type': 'text',
        }])).to.throw();
    });

    it('should return an array with one JML object when called with a single valid fragment', function () {
        expect(wrapJmlFragments({
            'name': 'person',
            'type': 'element',
        })).to.deep.equal([
            {
                'elements': [
                    {
                        'name': 'person',
                        'type': 'element',
                    },
                ],
            },
        ]);
    });

    it('should return an array with two JML objects when called with an array of two valid fragments', function () {
        expect(wrapJmlFragments([{
            'attributes': {'born': 'yes'},
            'name': 'person',
            'type': 'element',
        }, {
            'name': 'person',
            'type': 'element',
        }])).to.deep.equal([
            {
                'elements': [
                    {
                        'attributes': {
                            'born': 'yes',
                        },
                        'name': 'person',
                        'type': 'element',
                    },
                ],
            },
            {
                'elements': [
                    {
                        'name': 'person',
                        'type': 'element',
                    },
                ],
            },
        ]);
    });

});