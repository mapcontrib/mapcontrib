
import 'babel-polyfill';
import assert from 'assert';

import ThemeModel from '../../src/public/js/model/theme';
import UserModel from '../../src/public/js/model/user';



describe('ThemeModel', () => {

    let theme;

    before(() => {
        theme = new ThemeModel({
            'userId': '5d8e2fv4s65s8ze4sd8cv4v',
            'owners': [
                '5d8e2fv4s65s8ze4sd8cv4v',
                '5d8e2fv4s65s8ze4sdbbbbb'
            ],
            'fragment': 'a6g07ft',
            'name': 'A name with spécial-characterS_...'
        });
    });

    describe('buildPath', () => {
        it('Should return a complete path', () => {
            const expected = '/t/a6g07ft-A_name_with_special_characterS_';

            assert.strictEqual(theme.buildPath(), expected);
        });
    });

    describe('buildWebLinkName', () => {
        it('Should return a cleaned up name', () => {
            const expected = 'A_name_with_special_characterS_';

            assert.strictEqual(theme.buildWebLinkName(), expected);
        });
    });

    describe('isOwner', () => {
        it('Should be a owner by userId', () => {
            let user = new UserModel({ '_id': '5d8e2fv4s65s8ze4sd8cv4v' });
            assert.strictEqual(theme.isOwner(user), true);
        });

        it('Should be a owner by owners list', () => {
            let user = new UserModel({ '_id': '5d8e2fv4s65s8ze4sdbbbbb' });
            assert.strictEqual(theme.isOwner(user), true);
        });

        it('Should be a owner by wildcard', () => {
            let user = new UserModel({ '_id': '5d8e2fv4s65s8ze4sdbbbbb' });
            let theme = new ThemeModel({
                'owners': [
                    '*'
                ]
            });
            assert.strictEqual(theme.isOwner(user), true);
        });

        it('Shouldn\'t be a owner', () => {
            let user = new UserModel({ '_id': '5d8e2fv4s65s8ze4sdccccc' });
            assert.strictEqual(theme.isOwner(user), false);
        });
    });
});
