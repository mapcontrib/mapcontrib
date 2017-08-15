
import 'babel-polyfill';
import ThemeCore from './theme';


describe('ThemeModel', () => {
    describe('buildPath', () => {
        test('Should return a complete path', () => {
            const result = ThemeCore.buildPath('a6g07ft', 'A name with spécial-characterS_...');
            const expected = '/t/a6g07ft-A_name_with_special_characterS_';

            expect(result).toBe(expected);
        });
    });

    describe('buildWebLinkName', () => {
        test('Should return a cleaned up name', () => {
            const result = ThemeCore.buildWebLinkName('A name with spécial-characterS_...');
            const expected = 'A_name_with_special_characterS_';

            expect(result).toBe(expected);
        });

        test('Should not break if the name is undefined', () => {
            const result = ThemeCore.buildWebLinkName();
            const expected = '';

            expect(result).toBe(expected);
        });
    });
});
