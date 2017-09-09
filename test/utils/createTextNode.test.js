import {expect} from 'chai';

import createTextNode from '../../src/utils/createTextNode';

describe('createTextNode', function () {

    it('should return a valid text object when called with a string argument', function () {
        expect(
            createTextNode('a text'),
        ).to.deep.equal(
            {
                'elements': [
                    {
                        'text': 'a text',
                        'type': 'text',
                    },
                ],
            },
        );
    });

    it('should throw an error when called with a non-string argument', function () {
        expect(() => createTextNode({})).to.throw();
    });

});