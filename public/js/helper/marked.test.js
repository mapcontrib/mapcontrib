import 'babel-polyfill';
import MarkedHelper from './marked';

describe('MarkedHelper', () => {
  describe('render', () => {
    test('Should return markdown string transformed into HTML', () => {
      const expected =
        '<p><strong>This</strong> is <em>a test string</em>.</p>\n';
      const result = MarkedHelper.render('**This** is *a test string*.');

      expect(expected).toBe(result);
    });

    test('Should return a link with target _blank', () => {
      const expected =
        '<p>This is a <a title="Title of the link" href="http://mapcontrib.xyz" target="_blank" rel="noopener noreferrer">link</a>.</p>\n';
      const result = MarkedHelper.render(
        'This is a [link](http://mapcontrib.xyz "Title of the link").'
      );

      expect(expected).toBe(result);
    });
  });
});
