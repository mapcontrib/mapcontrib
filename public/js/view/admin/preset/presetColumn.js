import Wreqr from 'backbone.wreqr';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/admin/preset/presetColumn.ejs';

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
    categoriesList: '.rg_categories_list',
    list: '.rg_list'
  },

  ui: {
    column: '.column',
    categoriesList: '.rg_categories_list',
    backButton: '.back_btn',
    addButton: '.add_btn',
    addCategoryButton: '.add_category_btn'
  },

  events: {
    'click @ui.addButton': '_onClickAdd',
    'click @ui.backButton': '_onClickBack',
    'click @ui.addCategoryButton': '_onClickAddCategory'
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
      removeable: true,
      navigable: true
    });

    this.listenTo(
      this._categoriesListGroup,
      'item:remove',
      this._onRemoveCategory
    );
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
      reorderable: true,
      removeable: true,
      placeholder: document.l10n.getSync('uiListGroup_placeholder')
    });

    this.listenTo(this._presetsListGroup, 'reorder', this._onReorder);
    this.listenTo(this._presetsListGroup, 'item:remove', this._onRemove);
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

  _onReorder() {
    this.options.theme.updateModificationDate();
    this.options.theme.save();
  },

  _onRemove(model, e) {
    e.preventDefault();

    model.destroy();
    this.options.theme.save();
  },

  _onSelect(model) {
    const uuid = model.get('uuid');
    this.options.router.navigate(`admin/preset/edit/${uuid}`, true);
  },

  _onRemoveCategory(model, e) {
    e.preventDefault();

    model.destroy();
    this.options.theme.save();
    this._updateCategoriesDisplay();
  },

  _onSelectCategory(model) {
    const uuid = model.get('uuid');
    this.options.router.navigate(`admin/preset/category/edit/${uuid}`, true);
  },

  _onNavigateCategory(model) {
    const uuid = model.get('uuid');
    this.options.router.navigate(`admin/preset/${uuid}`, true);
  },

  _onClickAdd() {
    const categoryUuid = this._getCategoryUuid() || '';
    this.options.router.navigate(`admin/preset/new/${categoryUuid}`, true);
  },

  _onClickAddCategory() {
    const categoryUuid = this._getCategoryUuid() || '';
    this.options.router.navigate(
      `admin/preset/category/new/${categoryUuid}`,
      true
    );
  },

  _onClickBack() {
    const parentUuid = this.model.get('parentUuid') || '';
    this.options.router.navigate(`admin/preset/${parentUuid}`, true);
  },

  _getCategoryUuid() {
    if (this.model) {
      return this.model.get('uuid');
    }

    return undefined;
  }
});
