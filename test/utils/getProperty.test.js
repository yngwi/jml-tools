import {expect} from 'chai';

import getProperty from '../../src/utils/getProperty';

const element = {
    elements: [{
        'type': 'element',
        'name': 'anElement',
    }],
};

describe('getProperty', function () {

    it('should return undefined when trying to get a not-existing property', () => {
        expect(getProperty('text', element)).to.be.undefined;
    });

    it('should return the correct property value', () => {
        expect(getProperty('name', element)).to.equal('anElement');
    });

});