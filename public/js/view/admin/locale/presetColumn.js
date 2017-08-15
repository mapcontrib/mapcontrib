import Wreqr from 'backbone.wreqr';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/admin/locale/presetColumn.ejs';
import format from 'math.format';

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

  regions: {
    categoriesList: '.rg_categories_list',
    list: '.rg_list'
  },

  ui: {
    column: '.column',
    categoriesList: '.rg_categories_list',
    backButton: '.back_btn'
  },

  events: {
    'click @ui.backButton': '_onClickBack'
  },

  templateHelpers() {
    let title = document.l10n.getSync('adminPresetColumn_title');

    if (this.model) {
      title = this.model.get('name');
    }

    return {
      title
    };
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  onRender() {
    if (this.model) {
      this.ui.backButton.removeClass('hide');
    }

    const presetCategories = new Backbone.Collection(
      this.options.theme.get('presetCategories').where({
        parentUuid: this._getCategoryUuid()
      })
    );
    this._categoriesListGroup = new ListGroup({
      collection: presetCategories,
      labelAttribute: 'name',
      reorderable: false,
      removeable: false,
      navigable: true,
      getProgression: model => {
        const data = model.getLocaleCompletion(this.options.locale);
        return format(data.completed / data.items * 100, {
          floor: 1,
          ifInfinity: 0
        });
      }
    });

    this.listenTo(
      this._categoriesListGroup,
      'item:select',
      this._onSelectCategory
    );
    this.listenTo(
      this._categoriesListGroup,
      'item:navigate',
      this._onNavigateCategory
    );

    this.getRegion('categoriesList').show(this._categoriesListGroup);

    const presets = new Backbone.Collection(
      this.options.theme.get('presets').where({
        parentUuid: this._getCategoryUuid()
      })
    );
    presets.comparator = 'order';

    this._presetsListGroup = new ListGroup({
      collection: presets,
      labelAttribute: 'name',
      reorderable: false,
      removeable: false,
      placeholder: document.l10n.getSync(
        'uiListGroup_placeholderNothingToTranslate'
      ),
      getProgression: model => {
        const data = model.getLocaleCompletion(this.options.locale);
        return format(data.completed / data.items * 100, {
          floor: 1,
          ifInfinity: 0
        });
      }
    });

    this.listenTo(this._presetsListGroup, 'item:select', this._onSelect);

    this.getRegion('list').show(this._presetsListGroup);

    this._updateCategoriesDisplay();
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

  _updateCategoriesDisplay() {
    if (this._categoriesListGroup.countItems() === 0) {
      this.ui.categoriesList.addClass('hide');
    } else {
      this.ui.categoriesList.removeClass('hide');
    }
  },

  _onSelect(model) {
    const uuid = model.get('uuid');
    const locale = this.options.locale;
    this.options.router.navigate(
      `admin/locale/${locale}/preset/edit/${uuid}`,
      true
    );
  },

  _onSelectCategory(model) {
    const uuid = model.get('uuid');
    const locale = this.options.locale;
    this.options.router.navigate(
      `admin/locale/${locale}/preset/category/edit/${uuid}`,
      true
    );
  },

  _onNavigateCategory(model) {
    const uuid = model.get('uuid');
    const locale = this.options.locale;
    this.options.router.navigate(`admin/locale/${locale}/preset/${uuid}`, true);
  },

  _onClickBack() {
    const parentUuid = this.model.get('parentUuid') || '';
    const locale = this.options.locale;
    this.options.router.navigate(
      `admin/locale/${locale}/preset/${parentUuid}`,
      true
    );
  },

  _getCategoryUuid() {
    if (this.model) {
      return this.model.get('uuid');
    }

    return undefined;
  }
});
