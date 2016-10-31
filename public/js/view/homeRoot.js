
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
        scrollTarget: '.scroll_target',
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
        this._searchInput.on('search:before', this.showSearchPlaceholder, this);
        this._searchInput.on('focus', this._scrollToSearchInput, this);
        this._searchInput.on('keyup', this._scrollToSearchInput, this);
        this._searchInput.setFocus();

        this.getRegion('searchResults').show(
            new ThemeThumbList({
                collection: this.collection,
            })
        );
    },

    _scrollToSearchInput() {
        window.requestAnimationFrame(() => {
            this.ui.scrollTarget[0].scrollIntoView({ behavior: 'smooth' });
        });
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
        const startTime = this._lastQueryStartTime = new Date().getTime();

        this.collection.fetch({
            reset: true,
            merge: false,
            data: {
                q: searchString,
                hasLayer: true,
            },
            success: (collection, response, options) => {
                if (startTime !== this._lastQueryStartTime) {
                    return;
                }

                this.onThemesFetchSuccess(collection, response, options);
                this._searchInput.trigger('search:success');
                this._scrollToSearchInput();
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
        let themes = [];

        if (MAPCONTRIB.highlightList) {
            themes = JSON.parse(unescape( MAPCONTRIB.highlightList ));
        }

        if (!this.collection) {
            this.collection = new ThemeCollection(themes);
            this.render();
        }
        else {
            this.collection.reset(themes);
        }

        this.showResults();
    },

    displayLoginModal() {
        new LoginModalView({
            authSuccessCallback: '/create_theme',
            authFailCallback: '/',
        }).open();
    },

    showSearchPlaceholder() {
        this._scrollToSearchInput();

        this.ui.charactersLeftPlaceholderText.addClass('hide');

        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.removeClass('hide');
    },

    showCharactersLeftPlaceholder(searchString) {
        this._scrollToSearchInput();

        const charactersLeft = 3 - searchString.length;

        this.ui.charactersLeftPlaceholderText.html(
            document.l10n.getSync(
                'home_charactersLeft',
                { n: charactersLeft }
            )
        )
        .removeClass('hide');

        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.removeClass('hide');
    },

    showNoResultPlaceholder() {
        this._scrollToSearchInput();

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
