
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import DeviceHelper from 'helper/device';
import template from 'templates/user/userFavoriteThemesColumn.ejs';
import NavPillsStackedListView from 'ui/navPillsStacked';
import SearchInput from 'ui/form/searchInput';
import Locale from 'core/locale';
import ThemeCore from 'core/theme';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    regions: {
        searchInput: '.rg_search_input',
        themesNav: '.rg_themes_nav',
    },

    ui: {
        column: '.column',
        themesNav: '.rg_themes_nav',
        stickyInner: '.sticky-inner',
        noResult: '.no_result',
        backButton: '.back_btn',
    },

    events: {
        'click @ui.backButton': '_onClickBack',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._app = this.options.app;
        this._window = this._app.getWindow();
        this._config = this._app.getConfig();
        this._deviceHelper = new DeviceHelper(this._config, this._window);

        this._radio.vent.on('favorite:change', this.onFavoritesChange, this);
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    onBeforeClose() {
        this._radio.vent.off('favorite:change', this.onFavoritesChange);
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onFavoritesChange(collection) {
        const currentSearchString = this._currentSearchString;

        this.collection = collection;

        this._renderList();
        this._filterNavItems( this._defaultNavItems, currentSearchString );
    },

    onRender() {
        this._renderList();

        this._searchInput = new SearchInput({
            charactersMin: 1,
            placeholder: document.l10n.getSync('search'),
        });

        this.getRegion('searchInput').show( this._searchInput );

        if ( this._deviceHelper.isTallScreen() === true ) {
            this._searchInput.setFocus();
        }

        this._searchInput.on('search', this._filterNavItems.bind(this, this._defaultNavItems), this);
        this._searchInput.on('empty', this._setDefaultNavItems, this);
    },

    _renderList() {
        this._themesNav = new NavPillsStackedListView();
        this._defaultNavItems = this._buildNavItems(this.collection);

        this._setDefaultNavItems();
        this.getRegion('themesNav').show( this._themesNav );
    },

    _buildNavItems(collection) {
        return collection.models.map(theme => ({
            label: Locale.getLocalized(theme, 'name'),
            href: ThemeCore.buildPath(
                theme.get('fragment'),
                theme.get('name')
            ),
        }));
    },

    _setDefaultNavItems() {
        this._currentSearchString = '';

        this._hideNoResult();

        this._themesNav.setItems( this._defaultNavItems );
    },

    _filterNavItems(defaultNavItems, searchString) {
        this._currentSearchString = searchString;

        this._searchInput.trigger('search:success');
        this._hideNoResult();

        const re = new RegExp(searchString, 'i');
        const navItems = defaultNavItems.filter( item => re.test(item.label) );

        this._themesNav.setItems(navItems);

        if (navItems.length === 0) {
            this._showNoResult();
        }
    },

    _hideNoResult() {
        this.ui.noResult.addClass('hide');
    },

    _showNoResult() {
        this.ui.noResult.removeClass('hide');
    },

    _onClickBack() {
        this.options.router.navigate('user', true);
    },
});
