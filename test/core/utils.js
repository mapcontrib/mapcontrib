
import 'babel-polyfill';
import assert from 'assert';

import * as utils from '../../src/public/js/core/utils';



describe('Utils', () => {
    describe('basename', () => {
        it('Should return a basename', () => {
            const expected = 'myFile.jpg';
            const path = '/some/directories/to/go/to/myFile.jpg';

            let result = utils.basename(path);

            assert.equal(result, expected);
        });
    });

    describe('extensionname', () => {
        it('Should return a file extension', () => {
            const expected = 'jpg';
            const path = '/some/directories/to/go/to/myFile.jpg';

            let result = utils.extensionname(path);

            assert.equal(result, expected);
        });
    });
    
    describe('dirname', () => {
        it('Should return a directory', () => {
            const expected = '/some/directories/to/go/to';
            const path = '/some/directories/to/go/to/myFile.jpg';

            let result = utils.dirname(path);

            assert.equal(result, expected);
        });
    });
});
