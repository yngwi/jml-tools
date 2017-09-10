import {expect} from 'chai';

import getChildJmlObjects from '../../src/utils/getChildJmlObjects';

describe('unwrapJmlFragments', function () {

    it('should return null when called without arguments', () => {
        expect(getChildJmlObjects()).to.be.null;
    });

    it('should return null when called with an invalid argument', () => {
        expect(getChildJmlObjects({something: 'something'})).to.be.null;
    });

    it('should return a single object when called with an object that contains one child object', () => {
        expect(getChildJmlObjects({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [
                    {'type': 'element', 'name': 'childElement'},
                ],
            }],
        })).to.deep.equal([
            {elements: [{'type': 'element', 'name': 'childElement'}]},
        ]);
    });

    it('should return two objects when called with an object that contains two child objects', () => {
        expect(getChildJmlObjects({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [
                    {'type': 'element', 'name': 'childElement1'},
                    {'type': 'element', 'name': 'childElement2'},
                ],
            }],
        })).to.deep.equal([
            {elements: [{'type': 'element', 'name': 'childElement1'}]},
            {elements: [{'type': 'element', 'name': 'childElement2'}]},
        ]);
    });

    it('should return an empty array when called with an object with an empty child content array', () => {
        expect(getChildJmlObjects({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [],
            }],
        })).to.deep.equal([]);
    });

    it('should return an empty array when called with an object without child content', () => {
        expect(getChildJmlObjects({
            elements: [{
                'type': 'element',
                'name': 'element',
            }],
        })).to.deep.equal([]);
    });

});