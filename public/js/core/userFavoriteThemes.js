
export default class UserFavoriteThemes {
    constructor(user, favoriteThemesDataCollection) {
        this._user = user;
        this._favoriteThemesDataCollection = favoriteThemesDataCollection;
    }

    add(themeModel) {
        const fragment = themeModel.get('fragment');
        const favorites = [
            ...this._user.get('favoriteThemes'),
            fragment,
        ];

        this._user.set('favoriteThemes', favorites);
        this._user.save();

        this._favoriteThemesDataCollection.add({
            fragment: themeModel.get('fragment'),
            name: themeModel.get('name'),
            color: themeModel.get('color'),
        });
    }

    remove(themeModel) {
        const fragment = themeModel.get('fragment');
        const favorites = this._user.get('favoriteThemes').filter(
            favoriteFragment => favoriteFragment !== fragment
        );

        this._user.set('favoriteThemes', favorites);
        this._user.save();
    }

    has(themeModel) {
        const fragment = themeModel.get('fragment');
        const favorites = this._user.get('favoriteThemes');

        if ( favorites.indexOf(fragment) > -1 ) {
            return true;
        }

        return false;
    }

    toggle(themeModel) {
        if ( this.has(themeModel) ) {
            this.remove(themeModel);
        }
        else {
            this.add(themeModel);
        }
    }
}
