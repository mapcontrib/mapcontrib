
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
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    regions: {
        categoriesList: '.rg_categories_list',
        list: '.rg_list',
    },

    ui: {
        column: '.column',
        addButton: '.add_btn',
        addCategoryButton: '.add_category_btn',
    },

    events: {
        'click @ui.addButton': '_onClickAdd',
        'click @ui.addCategoryButton': '_onClickAddCategory',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const presetCategories = new Backbone.Collection(
            this.model.get('presetCategories').where({
                parentUuid: this.options.categoryUuid,
            })
        );
        const categoriesListGroup = new ListGroup({
            collection: presetCategories,
            labelAttribute: 'name',
            reorderable: false,
            removeable: true,
            navigable: true,
        });

        this.listenTo(categoriesListGroup, 'item:remove', this._onRemoveCategory);
        this.listenTo(categoriesListGroup, 'item:select', this._onSelectCategory);
        this.listenTo(categoriesListGroup, 'item:navigate', this._onNavigateCategory);

        this.getRegion('categoriesList').show( categoriesListGroup );


        const presets = new Backbone.Collection(
            this.model.get('presets').where({
                parentUuid: this.options.categoryUuid,
            })
        );
        const listGroup = new ListGroup({
            collection: presets,
            labelAttribute: 'name',
            reorderable: true,
            removeable: true,
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

        this.listenTo(listGroup, 'reorder', this._onReorder);
        this.listenTo(listGroup, 'item:remove', this._onRemove);
        this.listenTo(listGroup, 'item:select', this._onSelect);

        this.getRegion('list').show( listGroup );
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

    _onReorder() {
        this.model.updateModificationDate();
        this.model.save();
    },

    _onRemove(model, e) {
        e.preventDefault();

        model.destroy();
        this.model.save();
    },

    _onSelect(model) {
        const uuid = model.get('uuid');
        this.options.router.navigate(`admin/preset/edit/${uuid}`, true);
    },

    _onRemoveCategory(model, e) {
        e.preventDefault();

        model.destroy();
        this.model.save();
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
        const categoryUuid = this.options.categoryUuid || '';
        this.options.router.navigate(`admin/preset/new/${categoryUuid}`, true);
    },

    _onClickAddCategory() {
        const categoryUuid = this.options.categoryUuid || '';
        this.options.router.navigate(`admin/preset/category/new/${categoryUuid}`, true);
    },
});
