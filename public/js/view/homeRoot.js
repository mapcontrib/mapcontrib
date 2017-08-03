
import Marionette from 'backbone.marionette';
import DeviceHelper from 'helper/device';
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
        scrollTarget: '.scroll_target',
        searchResults: '#rg_search_results',
        noResultPlaceholder: '.no_result',
        charactersLeftPlaceholder: '.characters_left',
        charactersLeftPlaceholderText: '.characters_left .text',
        osmLink: '.openstreetmap',
    },

    regions: {
        searchInput: '.rg_search_input',
        searchResults: '#rg_search_results',
    },

    events: {
        'mouseenter @ui.osmLink': 'onHoverOsmLink',
    },

    initialize(options) {
        this._app = options.app;
        this._window = this._app.getWindow();
        this._document = this._app.getDocument();
        this._config = this._app.getConfig();
        this._deviceHelper = new DeviceHelper(this._config, this._window);

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
        this._searchInput.on('focus', this._checkScreenSizeAndScrollToSearchInput, this);
        this._searchInput.on('keyup', this._checkScreenSizeAndScrollToSearchInput, this);

        if ( this._deviceHelper.isTallScreen() === true ) {
            this._searchInput.setFocus();
        }

        this.getRegion('searchResults').show(
            new ThemeThumbList({
                collection: this.collection,
            })
        );
    },

    _checkScreenSizeAndScrollToSearchInput() {
        if ( this._deviceHelper.isTallScreen() === false ) {
            this._scrollToSearchInput();
        }
    },

    _scrollToSearchInput() {
        window.requestAnimationFrame(() => {
            this.ui.scrollTarget[0].scrollIntoView({ behavior: 'smooth' });
        });
    },

    fetchSearchedThemes(searchString) {
        const startTime = new Date().getTime();
        this._lastQueryStartTime = startTime;

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
                this._checkScreenSizeAndScrollToSearchInput();
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
        this._checkScreenSizeAndScrollToSearchInput();

        this.ui.charactersLeftPlaceholderText.addClass('hide');

        this.ui.noResultPlaceholder.addClass('hide');
        this.ui.searchResults.addClass('hide');
        this.ui.charactersLeftPlaceholder.removeClass('hide');
    },

    showCharactersLeftPlaceholder(searchString) {
        this._checkScreenSizeAndScrollToSearchInput();

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
        this._checkScreenSizeAndScrollToSearchInput();

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
