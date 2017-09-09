import {expect} from 'chai';

import createElement from '../../src/modules/createElement';

describe('createElement', function () {

    it('should throw an error when called without arguments', function () {
        expect(() => createElement(),).to.throw();
    });

});