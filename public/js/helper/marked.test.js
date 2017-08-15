
import 'babel-polyfill';
import MarkedHelper from './marked';


describe('MarkedHelper', () => {
    describe('render', () => {
        test('Should return markdown string transformed into HTML', () => {
            const expected = '<p><strong>This</strong> is <em>a test string</em>.</p>\n';
            const result = MarkedHelper.render('**This** is *a test string*.');

            expect(expected).toBe(result);
        });

        test('Should return a link with target _blank', () => {
            const expected = '<p>This is a <a href="http://mapcontrib.xyz" rel="noopener noreferrer" target="_blank">link</a>.</p>\n';
            const result = MarkedHelper.render('This is a [link](http://mapcontrib.xyz).');

            expect(expected).toBe(result);
        });
    });
});
