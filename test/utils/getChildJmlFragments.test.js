import {expect} from 'chai';

import getChildJmlFragments from '../../src/utils/getChildJmlFragments';

describe('getChildJmlFragments', function () {

    it('should return null when called without arguments', () => {
        expect(getChildJmlFragments()).to.be.null;
    });

    it('should return null when called with an invalid argument', () => {
        expect(getChildJmlFragments({something: 'something'})).to.be.null;
    });

    it('should return a single object when called with an object that contains one child object', () => {
        expect(getChildJmlFragments({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [
                    {'type': 'element', 'name': 'childElement'},
                ],
            }],
        })).to.deep.equal([
            {'type': 'element', 'name': 'childElement'},
        ]);
    });

    it('should return two objects when called with an object that contains two child objects', () => {
        expect(getChildJmlFragments({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [
                    {'type': 'element', 'name': 'name'},
                    {'type': 'text', 'text': 'some text'},
                ],
            }],
        })).to.deep.equal([
            {'type': 'element', 'name': 'name'},
            {'type': 'text', 'text': 'some text'},
        ]);
    });

    it('should return an empty array when called with an object with an empty child content array', () => {
        expect(getChildJmlFragments({
            elements: [{
                'type': 'element',
                'name': 'element',
                'elements': [],
            }],
        })).to.deep.equal([]);
    });

    it('should return an empty array when called with an object without child content', () => {
        expect(getChildJmlFragments({
            elements: [{
                'type': 'element',
                'name': 'element',
            }],
        })).to.deep.equal([]);
    });

});