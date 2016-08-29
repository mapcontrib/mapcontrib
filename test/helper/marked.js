
import 'babel-polyfill';
import assert from 'assert';

import MarkedHelper from '../../public/js/helper/marked';



describe('MarkedHelper', () => {
    describe('render', () => {
        it('Should return markdown string transformed into HTML', () => {
            const expected = '<p><strong>This</strong> is <em>a test string</em>.</p>\n';
            const result = MarkedHelper.render('**This** is *a test string*.');

            assert.strictEqual(expected, result);
        });

        it('Should return a link with target _blank', () => {
            const expected = '<p>This is a <a href="http://mapcontrib.xyz" rel="noopener noreferrer" target="_blank">link</a>.</p>\n';
            const result = MarkedHelper.render('This is a [link](http://mapcontrib.xyz).');

            assert.strictEqual(expected, result);
        });
    });
});
