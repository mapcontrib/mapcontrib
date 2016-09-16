
import Marionette from 'backbone.marionette';
import LoginModalView from './loginModal';
import ThemeCollection from 'collection/theme';
import ThemeThumbList from 'ui/themeThumbList';
import SearchInput from 'ui/form/searchInput';
import template from 'templates/homeRoot.ejs';

export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
    },

    ui: {
        createThemeButton: '.create_theme_btn',
        searchResults: '#rg_search_results',
        noResultPlaceholder: '.no_result',
        charactersLeftPlaceholder: '.characters_left',
        charactersLeftPlaceholderText: '.characters_left .text',
    },

    regions: {
        searchInput: '.rg_search_input',
        searchResults: '#rg_search_results',
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
        this._searchInput = new SearchInput({
            placeholder: document.l10n.getSync('searchATheme'),
        });

        this.getRegion('searchInput').show( this._searchInput );

        this._searchInput.on('empty', this.resetThemeCollection, this);
        this._searchInput.on('notEnoughCharacters', this.showCharactersLeftPlaceholder, this);
        this._searchInput.on('search', this.fetchSearchedThemes, this);
        this._searchInput.setFocus();

        this.getRegion('searchResults').show(
            new ThemeThumbList({
                collection: this.collection,
            })
        );
    },

    onClickCreateTheme() {
        if (this._app.isLogged()) {
            window.location.replace('/create_theme');
        }
        else {
            this.displayLoginModal();
        }
    },

    fetchSearchedThemes(searchString) {
        this.collection.fetch({
            reset: true,
            merge: false,
            data: {
                q: searchString,
                hasLayer: true,
            },
            success: (collection, response, options) => {
                this.onThemesFetchSuccess(collection, response, options);
                this._searchInput.trigger('search:success');
            },
            error: (collection, response, options) => {
                this.onThemesFetchError(collection, response, options);
                this._searchInput.trigger('search:error');
            },
        });
    },

    onThemesFetchSuccess(collection) {
        if (collection.models.length === 0) {
            this.showNoResultPlaceholder();
        }
        else {
            this.showResults();
        }
    },

    onThemesFetchError() {
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
            authSuccessCallback: '/create_theme',
            authFailCallback: '/',
        }).open();
    },

    showCharactersLeftPlaceholder(searchString) {
        const charactersLeft = 3 - searchString.length;

        this.ui.charactersLeftPlaceholderText.html(
            document.l10n.getSync(
                'home_charactersLeft',
                { n: charactersLeft }
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
