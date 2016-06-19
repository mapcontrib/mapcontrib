
import Marionette from 'backbone.marionette';
import LoginModalView from './loginModal';
import ThemeModel from '../model/theme';
import ThemeCollection from '../collection/theme';
import ThemeThumbList from '../ui/themeThumbList';
import template from '../../templates/homeRoot.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
    },

    ui: {
        'createThemeButton': '.create_theme_btn',
        'searchInput': '#q',
    },

    regions: {
        'loginModal': '#rg_login_modal',
        'searchResults': '#rg_search_results',
    },

    events: {
        'click @ui.createThemeButton': 'onClickCreateTheme',
        'keyup @ui.searchInput': 'onKeyUpSearchInput',
    },

    initialize: function (options) {
        this._app = options.app;
        this._window = this._app.getWindow();
        this._document = this._app.getDocument();
        this._searchTimeout = null;
        this.collection = new ThemeCollection();

        if (window.highlightList) {
            this.collection.add(window.highlightList);
        }
    },

    onRender: function () {
        this.getRegion('searchResults').show(
            new ThemeThumbList({
                'collection': this.collection
            })
        );
    },

    onClickCreateTheme: function (e) {
        if (this._app.isLogged()) {
            window.location.replace('/create_theme');
        }
        else {
            this.displayLoginModal();
        }
    },

    onKeyUpSearchInput: function (e) {
        clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(
            this.fetchSearchedThemes.bind(this),
            300
        );
    },

    fetchSearchedThemes: function () {
        let searchString = this.ui.searchInput.val();

        if (!searchString) {
            return false;
        }

        this.collection.fetch({
            'reset': true,
            'merge': false,
            'data': {
                'q': searchString,
                'hasLayer': true
            }
        });
    },

    displayLoginModal: function () {
        let loginModalView = new LoginModalView({
            'authSuccessCallback': '/create_theme',
            'authFailCallback': '/'
        });

        this.getRegion('loginModal').show( loginModalView );
    }
});
