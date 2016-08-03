
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
        'noResultPlaceholder': '.no_result',
        'charactersLeftPlaceholder': '.characters_left',
        'charactersLeftPlaceholderText': '.characters_left .text',
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
        const searchString = this.ui.searchInput.val();
        const charactersCount = this.ui.searchInput.val().length;

        if ( this._lastSearchedString === searchString ) {
            return true;
        }

        this._lastSearchedString = searchString;

        clearTimeout(this._searchTimeout);

        if (charactersCount === 0) {
            this.hideSpinner();
            this.resetThemeCollection();
        }
        else if (charactersCount > 0 && charactersCount < 3) {
            this.hideSpinner();
            this.showCharactersLeftPlaceholder();
        }
        else {
            this.showSpinner();
            this.hidePlaceholders();

            this._searchTimeout = setTimeout(
                this.fetchSearchedThemes.bind(this, searchString),
                300
            );
        }
    },

    fetchSearchedThemes: function (searchString) {
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
            this.showNoResultPlaceholder();
        }
        else {
            this.showResults();
        }
    },

    onThemesFetchError: function (collection, response, options) {
        this.hideSpinner();
        this.showNoResultPlaceholder();
    },

    resetThemeCollection: function () {
        this.collection = new ThemeCollection();

        if (MAPCONTRIB.highlightList) {
            this.collection.add(
                JSON.parse(unescape( MAPCONTRIB.highlightList ))
            );
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

    showCharactersLeftPlaceholder: function () {
        const charactersLeft = 3 - this.ui.searchInput.val().length;

        this.ui.charactersLeftPlaceholderText.html(
            document.l10n.getSync(
                'home_charactersLeft',
                { 'n': charactersLeft }
            )
        );

        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.removeClass('hide');
    },

    showNoResultPlaceholder: function () {
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.noResultPlaceholder.removeClass('hide');
    },

    showResults: function () {
        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.searchResults.removeClass('hide');
    },

    showSpinner: function () {
        this.ui.searchIcon.addClass('hide');
        this.ui.searchSpinner.removeClass('hide');
    },

    hidePlaceholders: function () {
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.noResultPlaceholder.addClass('hide');
    },

    hideSpinner: function () {
        this.ui.searchSpinner.addClass('hide');
        this.ui.searchIcon.removeClass('hide');
    },
});
