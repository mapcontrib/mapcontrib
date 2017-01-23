
import 'babel-polyfill';
import assert from 'assert';

import ThemeModel from 'model/theme';
import UserModel from 'model/user';


describe('ThemeModel', () => {
    let theme;

    before(() => {
        theme = new ThemeModel({
            userId: '5d8e2fv4s65s8ze4sd8cv4v',
            owners: [
                '5d8e2fv4s65s8ze4sd8cv4v',
                '5d8e2fv4s65s8ze4sdbbbbb',
            ],
            fragment: 'a6g07ft',
            name: 'A name with spécial-characterS_...',
        });
    });

    describe('isOwner', () => {
        it('Should be a owner by userId', () => {
            const user = new UserModel({ _id: '5d8e2fv4s65s8ze4sd8cv4v' });
            assert.strictEqual(theme.isOwner(user), true);
        });

        it('Should be a owner by owners list', () => {
            const user = new UserModel({ _id: '5d8e2fv4s65s8ze4sdbbbbb' });
            assert.strictEqual(theme.isOwner(user), true);
        });

        it('Should be a owner by wildcard', () => {
            const user = new UserModel({ _id: '5d8e2fv4s65s8ze4sdbbbbb' });
            const otherTheme = new ThemeModel({
                owners: [
                    '*',
                ],
            });
            assert.strictEqual(otherTheme.isOwner(user), true);
        });

        it('Shouldn\'t be a owner', () => {
            const user = new UserModel({ _id: '5d8e2fv4s65s8ze4sdccccc' });
            assert.strictEqual(theme.isOwner(user), false);
        });
    });
});
