import {expect} from 'chai';

import unwrapJmlFragment from '../../src/utils/unwrapJmlFragment';

describe('unwrapJmlFragments', function () {

    it('should return null if called without arguments', function () {
        expect(unwrapJmlFragment()).to.be.null;
    });

    it('should return null if called with an invalid element', function () {
        expect(unwrapJmlFragment({some: 'element'})).to.be.null;
    });

    it('should return a valid fragment if called with a valid element', function () {
        expect(unwrapJmlFragment({
            'elements': [
                {
                    'name': 'person',
                    'type': 'element',
                },
            ],
        })).to.deep.equal({
            'name': 'person',
            'type': 'element',
        });
    });

});