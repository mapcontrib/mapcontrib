
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/user/userThemesColumn.ejs';
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
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._app = this.options.app;
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onRender() {
        const defaultNavItems = this._buildNavItems(this.collection);

        this._themesNav = new NavPillsStackedListView();
        this._themesNav.setItems(defaultNavItems);
        this.getRegion('themesNav').show( this._themesNav );


        this._searchInput = new SearchInput({
            charactersMin: 1,
            placeholder: document.l10n.getSync('search'),
        });

        this.getRegion('searchInput').show( this._searchInput );
        this._searchInput.setFocus();
        this._searchInput.on('search', this._filterNavItems.bind(this, this.collection), this);
        this._searchInput.on('empty', this._themesNav.setItems.bind(this._themesNav, defaultNavItems), this);
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

    _buildSearchedNavItems(collection, searchString) {
        const re = new RegExp(searchString, 'i');

        return collection.models
        .filter( theme => re.test(theme.get('name')) )
        .map(theme => ({
            label: Locale.getLocalized(theme, 'name'),
            href: ThemeCore.buildPath(
                theme.get('fragment'),
                theme.get('name')
            ),
        }));
    },

    _filterNavItems(collection, searchString) {
        this._searchInput.trigger('search:success');
        this._hideNoResult();

        const navItems = this._buildSearchedNavItems(collection, searchString);
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
});
