
import Wreqr from 'backbone.wreqr';
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
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const categoriesListGroup = new ListGroup({
            collection: this.model.get('presetCategories'),
            labelAttribute: 'name',
            reorderable: false,
            removeable: true,
            getLeftIcon: () => '<i class="fa fa-fw fa-caret-right"></i>',
        });

        this.listenTo(categoriesListGroup, 'item:remove', this._onRemoveCategory);
        this.listenTo(categoriesListGroup, 'item:select', this._onSelectCategory);

        this.getRegion('categoriesList').show( categoriesListGroup );

        const listGroup = new ListGroup({
            collection: this.model.get('presets'),
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
});
