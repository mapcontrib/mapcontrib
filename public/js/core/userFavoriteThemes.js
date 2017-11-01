import UserFavoriteThemesDataCollection from 'collection/userFavoriteThemesData';

export default class UserFavoriteThemes {
  constructor(user, favoriteThemesDataCollection) {
    this._user = user;
    this._favoriteThemesDataCollection = favoriteThemesDataCollection;
  }

  add(themeModel) {
    const fragment = themeModel.get('fragment');
    const favorites = [...this._user.get('favoriteThemes'), fragment];

    this._user.set('favoriteThemes', favorites);
    this._user.save();

    this.setThemeData(themeModel);
  }

  setThemeData(themeModel) {
    this._favoriteThemesDataCollection.add(
      {
        fragment: themeModel.get('fragment'),
        name: themeModel.get('name'),
        color: themeModel.get('color')
      },
      {
        merge: true
      }
    );
  }

  remove(themeModel) {
    const fragment = themeModel.get('fragment');
    const favorites = this._user
      .get('favoriteThemes')
      .filter(favoriteFragment => favoriteFragment !== fragment);

    this._user.set('favoriteThemes', favorites);
    this._user.save();
  }

  has(themeModel) {
    const fragment = themeModel.get('fragment');
    const favorites = this._user.get('favoriteThemes');

    if (favorites.indexOf(fragment) > -1) {
      return true;
    }

    return false;
  }

  toggle(themeModel) {
    if (this.has(themeModel)) {
      this.remove(themeModel);
    } else {
      this.add(themeModel);
    }
  }

  getCollection() {
    const models = this._user
      .get('favoriteThemes')
      .filter(fragment => {
        const model = this._favoriteThemesDataCollection.findWhere({
          fragment
        });

        if (model) {
          return true;
        }

        return false;
      })
      .map(fragment => {
        const model = this._favoriteThemesDataCollection.findWhere({
          fragment
        });
        return {
          fragment: model.get('fragment'),
          name: model.get('name'),
          color: model.get('color')
        };
      });

    return new UserFavoriteThemesDataCollection(models);
  }
}
