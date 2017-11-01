import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetSelectionView from 'ui/presetSelection';
import template from 'templates/contribute/add/presetSelectionColumn.ejs';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.previousRoute
      }
    };
  },

  regions: {
    searchInput: '.rg_search_input',
    presetsNav: '.rg_presets_nav'
  },

  ui: {
    column: '.column',
    presetsNav: '.rg_presets_nav',
    stickyInner: '.sticky-inner',
    noResult: '.no_result',
    footer: '.sticky-footer',
    freeAdditionBtn: '.free_addition_btn'
  },

  events: {
    'click @ui.freeAdditionBtn': '_onClickFreeAddition'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
    this._presets = this.options.theme.get('presets');
    this._presetCategories = this.options.theme.get('presetCategories');
    this._iDPresetsHelper = this.options.iDPresetsHelper;
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
    const presetSelectionView = new PresetSelectionView({
      app: this.options.app,
      theme: this.options.theme,
      iDPresetsHelper: this.options.iDPresetsHelper,
      regions: {
        searchInput: this.getRegion('searchInput'),
        presetsNav: this.getRegion('presetsNav')
      },
      callbacks: {
        iD: this._onClickIDPreset.bind(this),
        customPreset: this._onClickCustomPreset.bind(this)
      }
    });

    presetSelectionView.on('search:success', this._scrollToResultsTop, this);
    presetSelectionView.on('search:success', this._hideNoResult, this);
    presetSelectionView.on('empty', this._hideNoResult, this);
    presetSelectionView.on('search:noResult', this._showNoResult, this);

    if (!this.options.config.freeTagsContributionEnabled) {
      this._hideFooter();
    }
  },

  _scrollToResultsTop() {
    window.requestAnimationFrame(() => {
      this.ui.stickyInner[0].scroll({ top: 0, behavior: 'smooth' });
    });
  },

  _hideNoResult() {
    this.ui.noResult.addClass('hide');
  },

  _showNoResult() {
    this.ui.noResult.removeClass('hide');
  },

  _hideFooter() {
    this.ui.footer.addClass('hide');
  },

  _onClickFreeAddition() {
    const center = this.options.center;
    this.options.router.navigate(
      `contribute/add/${center.lat}/${center.lng}/no-preset`,
      true
    );
  },

  _onClickIDPreset(preset) {
    const center = this.options.center;

    this.options.router.navigate(
      `contribute/add/${center.lat}/${center.lng}/iD/${preset.presetName}`,
      true
    );
  },

  _onClickCustomPreset(preset) {
    const center = this.options.center;

    this.options.router.navigate(
      `contribute/add/${center.lat}/${center.lng}/${preset.get('uuid')}`,
      true
    );
  }
});
