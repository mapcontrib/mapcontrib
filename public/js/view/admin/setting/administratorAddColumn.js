import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/administrator/administratorAddColumn.ejs';
import SearchInput from 'ui/form/searchInput';
import DeviceHelper from 'helper/device';
import { findUsersFromDisplayName, getUserInfoFromId } from 'helper/osmUsers';
import NavPillsStackedListView from 'ui/navPillsStacked';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.routeOnClose,
        triggerRouteOnClose: this.options.triggerRouteOnClose
      }
    };
  },

  ui: {
    column: '.column',
    noResultPlaceholder: '.placeholder_no_result',
    searchResults: '.rg_search_results'
  },

  events: {
    submit: '_onSubmit',
    reset: '_onReset'
  },

  regions: {
    searchInput: '.rg_search_input',
    searchResults: '.rg_search_results'
  },

  initialize() {
    this._app = this.options.app;
    this._radio = Wreqr.radio.channel('global');
    this._window = this._app.getWindow();
    this._document = this._app.getDocument();
    this._config = this._app.getConfig();
    this._deviceHelper = new DeviceHelper(this._config, this._window);

    this._searchResults = [];
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
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
    this._searchInput = new SearchInput();

    this.getRegion('searchInput').show(this._searchInput);

    this._searchInput.on('empty', this._resetResults, this);
    this._searchInput.on('search', this._fetchOsmContributors, this);

    if (this._deviceHelper.isTallScreen() === true) {
      this._searchInput.setFocus();
    }

    this._navItems = new NavPillsStackedListView();
    this.showResults();

    this.getRegion('searchResults').show(this._navItems);
  },

  _fetchOsmContributors(searchString) {
    const startTime = new Date().getTime();
    this._lastQueryStartTime = startTime;

    findUsersFromDisplayName(searchString)
      .then(osmContributors => {
        if (startTime !== this._lastQueryStartTime) {
          return;
        }

        this._onOsmContributorsFetchSuccess(osmContributors);
        this._searchInput.trigger('search:success');
      })
      .catch(() => {
        this._onOsmContributorsFetchError();
        this._searchInput.trigger('search:error');
      });
  },

  _onOsmContributorsFetchSuccess(osmContributors) {
    if (osmContributors.length === 0) {
      this.showNoResultPlaceholder();
    } else {
      this._searchResults = osmContributors;
      this.showResults();
    }
  },

  _onOsmContributorsFetchError() {
    this.showNoResultPlaceholder();
  },

  _resetResults() {
    this._searchResults = [];
    this.showResults();
  },

  showNoResultPlaceholder() {
    this.ui.searchResults.addClass('hide');
    this.ui.noResultPlaceholder.removeClass('hide');
  },

  showResults() {
    const navItems = this._searchResults.map(osmContributor => ({
      label: osmContributor.displayName,
      callback: () => this._onClickOsmContributor(osmContributor)
    }));
    this._navItems.setItems(navItems);

    this.ui.noResultPlaceholder.addClass('hide');
    this.ui.searchResults.removeClass('hide');
  },

  _onClickOsmContributor(osmContributor) {
    this.model.set('osmOwners', [
      ...this.model.get('osmOwners'),
      osmContributor.id
    ]);

    getUserInfoFromId(osmContributor.id).then(userInfos => {
      this.collection.add({
        osmId: userInfos.id,
        displayName: userInfos.displayName,
        avatar: userInfos.avatar
      });

      this.model.save();
      this.options.router.navigate('admin/setting/administrator', true);
    });
  },

  hidePlaceholders() {
    this.ui.noResultPlaceholder.addClass('hide');
  }
});
