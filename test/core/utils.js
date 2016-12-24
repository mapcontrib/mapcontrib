
import 'babel-polyfill';
import assert from 'assert';

import * as utils from 'core/utils';


describe('Utils', () => {
    describe('basename', () => {
        it('Should return a basename', () => {
            const expected = 'myFile.jpg';
            const path = '/some/directories/to/go/to/myFile.jpg';

            const result = utils.basename(path);

            assert.equal(result, expected);
        });
    });

    describe('extensionname', () => {
        it('Should return a file extension', () => {
            const expected = 'jpg';
            const path = '/some/directories/to/go/to/myFile.jpg';

            const result = utils.extensionname(path);

            assert.equal(result, expected);
        });
    });

    describe('dirname', () => {
        it('Should return a directory', () => {
            const expected = '/some/directories/to/go/to';
            const path = '/some/directories/to/go/to/myFile.jpg';

            const result = utils.dirname(path);

            assert.equal(result, expected);
        });
    });

    describe('formatBytes', () => {
        it('Should format a file size', () => {
            assert.equal(
                utils.formatBytes(0),
                '0 Byte'
            );
            assert.equal(
                utils.formatBytes(12345),
                '12.056 KB'
            );
            assert.equal(
                utils.formatBytes(12345, 2),
                '12.056 KB'
            );
            assert.equal(
                utils.formatBytes(456789123, 0),
                '435.6 MB'
            );
            assert.equal(
                utils.formatBytes(456789123, 1),
                '435.63 MB'
            );
            assert.equal(
                utils.formatBytes(456789123, 2),
                '435.628 MB'
            );
            assert.equal(
                utils.formatBytes(456789123, 4),
                '435.62805 MB'
            );
        });
    });

    describe('uuid', () => {
        it('Should return a well formed uniq ID', () => {
            const expectedType = 'string';
            const formatRegex = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;

            const uuid = utils.uuid();

            assert.equal(typeof uuid, expectedType);
            assert.equal(formatRegex.test(uuid), true);
        });
    });
});
