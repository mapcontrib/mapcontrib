
import Marionette from 'backbone.marionette';
import LoginModalView from './loginModal';
import ThemeModel from '../model/theme';
import ThemeCollection from '../collection/theme';
import ThemeThumbList from '../ui/themeThumbList';
import SearchInput from '../ui/form/searchInput';
import template from '../../templates/homeRoot.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
    },

    ui: {
        'createThemeButton': '.create_theme_btn',
        'searchResults': '#rg_search_results',
        'noResultPlaceholder': '.no_result',
        'charactersLeftPlaceholder': '.characters_left',
        'charactersLeftPlaceholderText': '.characters_left .text',
    },

    regions: {
        'searchInput': '.rg_search_input',
        'searchResults': '#rg_search_results',
    },

    events: {
        'click @ui.createThemeButton': 'onClickCreateTheme',
    },

    initialize(options) {
        this._app = options.app;
        this._window = this._app.getWindow();
        this._document = this._app.getDocument();

        this.resetThemeCollection();
    },

    onRender() {
        const searchInput = new SearchInput({
            placeholder: document.l10n.getSync('searchATheme'),
            onSearch: this.fetchSearchedThemes.bind(this)
        });

        this.getRegion('searchInput').show( searchInput );

        searchInput.on('empty', this.resetThemeCollection, this);
        searchInput.on('notEnoughCharacters', this.showCharactersLeftPlaceholder, this);
        searchInput.on('search', this.fetchSearchedThemes, this);
        searchInput.setFocus();

        this.getRegion('searchResults').show(
            new ThemeThumbList({
                'collection': this.collection
            })
        );
    },

    onClickCreateTheme(e) {
        if (this._app.isLogged()) {
            window.location.replace('/create_theme');
        }
        else {
            this.displayLoginModal();
        }
    },

    fetchSearchedThemes(searchString) {
        return new Promise((resolve, reject) => {
            this.collection.fetch({
                'reset': true,
                'merge': false,
                'data': {
                    'q': searchString,
                    'hasLayer': true
                },
                'success': (collection, response, options) => {
                    this.onThemesFetchSuccess(collection, response, options);
                    resolve();
                },
                'error': (collection, response, options) => {
                    this.onThemesFetchError(collection, response, options);
                    reject();
                },
            });
        });
    },

    onThemesFetchSuccess(collection, response, options) {
        if (collection.models.length === 0) {
            this.showNoResultPlaceholder();
        }
        else {
            this.showResults();
        }
    },

    onThemesFetchError(collection, response, options) {
        this.showNoResultPlaceholder();
    },

    resetThemeCollection() {
        this.collection = new ThemeCollection();

        if (MAPCONTRIB.highlightList) {
            this.collection.add(
                JSON.parse(unescape( MAPCONTRIB.highlightList ))
            );
        }

        this.render();
        this.showResults();
    },

    displayLoginModal() {
        new LoginModalView({
            'authSuccessCallback': '/create_theme',
            'authFailCallback': '/'
        }).open();
    },

    showCharactersLeftPlaceholder(searchString) {
        const charactersLeft = 3 - searchString.length;

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

    showNoResultPlaceholder() {
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.noResultPlaceholder.removeClass('hide');
    },

    showResults() {
        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.searchResults.removeClass('hide');
    },

    hidePlaceholders() {
        this.ui.charactersLeftPlaceholder.addClass('hide');
        this.ui.noResultPlaceholder.addClass('hide');
    },
});
