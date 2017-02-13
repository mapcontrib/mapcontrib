
import 'babel-polyfill';
import assert from 'assert';
import ThemeCore from 'core/theme';


describe('ThemeModel', () => {
    describe('buildPath', () => {
        it('Should return a complete path', () => {
            const expected = '/t/a6g07ft-A_name_with_special_characterS_';

            assert.strictEqual(
                ThemeCore.buildPath('a6g07ft', 'A name with spécial-characterS_...'),
                expected
            );
        });
    });

    describe('buildWebLinkName', () => {
        it('Should return a cleaned up name', () => {
            const expected = 'A_name_with_special_characterS_';

            assert.strictEqual(
                ThemeCore.buildWebLinkName('A name with spécial-characterS_...'),
                expected
            );
        });

        it('Should not break if the name is undefined', () => {
            const expected = '';

            assert.strictEqual(
                ThemeCore.buildWebLinkName(),
                expected
            );
        });
    });
});
