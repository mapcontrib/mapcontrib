
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
        'searchIcon': 'input.search + label .icon',
        'searchSpinner': 'input.search + label .spinner',
        'searchResults': '#rg_search_results',
        'noResultMessage': '.no_result',
        'charactersLeftMessage': '.characters_left',
        'charactersLeftMessageText': '.characters_left .text',
    },

    regions: {
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

        this.resetThemeCollection();
    },

    onRender: function () {
        this.getRegion('searchResults').show(
            new ThemeThumbList({
                'collection': this.collection
            })
        );

        this.ui.searchInput.focus();
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

        const charactersCount = this.ui.searchInput.val().length;

        if (charactersCount === 0) {
            this.hideSpinner();
            this.resetThemeCollection();
        }
        else if (charactersCount > 0 && charactersCount < 3) {
            this.hideSpinner();
            this.showCharactersLeftMessage();
        }
        else {
            this.showSpinner();

            this._searchTimeout = setTimeout(
                this.fetchSearchedThemes.bind(this),
                300
            );
        }
    },

    fetchSearchedThemes: function () {
        let searchString = this.ui.searchInput.val();

        this.collection.fetch({
            'reset': true,
            'merge': false,
            'data': {
                'q': searchString,
                'hasLayer': true
            },
            'success': this.onThemesFetchSuccess.bind(this),
            'error': this.onThemesFetchError.bind(this),
        });
    },

    onThemesFetchSuccess: function (collection, response, options) {
        this.hideSpinner();

        if (collection.models.length === 0) {
            this.showNoResultMessage();
        }
        else {
            this.showResults();
        }
    },

    onThemesFetchError: function (collection, response, options) {
        this.hideSpinner();
        this.showNoResultMessage();
    },

    resetThemeCollection: function () {
        this.collection = new ThemeCollection();

        if (MAPCONTRIB.highlightList) {
            this.collection.add(MAPCONTRIB.highlightList);
        }

        this.render();
        this.showResults();
    },

    displayLoginModal: function () {
        new LoginModalView({
            'authSuccessCallback': '/create_theme',
            'authFailCallback': '/'
        }).open();
    },

    showCharactersLeftMessage: function () {
        const charactersLeft = 3 - this.ui.searchInput.val().length;

        this.ui.charactersLeftMessageText.html(
            document.l10n.getSync(
                'home_charactersLeft',
                { 'n': charactersLeft }
            )
        );

        this.ui.noResultMessage.addClass('hide');
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftMessage.removeClass('hide');
    },

    showNoResultMessage: function () {
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftMessage.addClass('hide');
        this.ui.noResultMessage.removeClass('hide');
    },

    showResults: function () {
        this.ui.noResultMessage.addClass('hide');
        this.ui.charactersLeftMessage.addClass('hide');
        this.ui.searchResults.removeClass('hide');
    },

    showSpinner: function () {
        this.ui.searchIcon.addClass('hide');
        this.ui.searchSpinner.removeClass('hide');
    },

    hideSpinner: function () {
        this.ui.searchSpinner.addClass('hide');
        this.ui.searchIcon.removeClass('hide');
    },
});
