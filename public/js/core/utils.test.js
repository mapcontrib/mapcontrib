import 'babel-polyfill';
import * as utils from './utils';

describe('Utils', () => {
  describe('basename', () => {
    test('Should return a basename', () => {
      const expected = 'myFile.jpg';
      const path = '/some/directories/to/go/to/myFile.jpg';

      const result = utils.basename(path);

      expect(result).toBe(expected);
    });
  });

  describe('extensionname', () => {
    test('Should return a file extension', () => {
      const expected = 'jpg';
      const path = '/some/directories/to/go/to/myFile.jpg';

      const result = utils.extensionname(path);

      expect(result).toBe(expected);
    });
  });

  describe('dirname', () => {
    test('Should return a directory', () => {
      const expected = '/some/directories/to/go/to';
      const path = '/some/directories/to/go/to/myFile.jpg';

      const result = utils.dirname(path);

      expect(result).toBe(expected);
    });
  });

  describe('formatBytes', () => {
    test('Should format a file size', () => {
      expect(utils.formatBytes(0)).toBe('0 Byte');
      expect(utils.formatBytes(12345)).toBe('12.056 KB');
      expect(utils.formatBytes(12345, 2)).toBe('12.056 KB');
      expect(utils.formatBytes(456789123, 0)).toBe('435.6 MB');
      expect(utils.formatBytes(456789123, 1)).toBe('435.63 MB');
      expect(utils.formatBytes(456789123, 2)).toBe('435.628 MB');
      expect(utils.formatBytes(456789123, 4)).toBe('435.62805 MB');
    });
  });

  describe('uuid', () => {
    test('Should return a well formed uniq ID', () => {
      const expectedType = 'string';
      const formatRegex = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;

      const uuid = utils.uuid();

      expect(typeof uuid).toBe(expectedType);
      expect(formatRegex.test(uuid)).toBe(true);
    });
  });
});
