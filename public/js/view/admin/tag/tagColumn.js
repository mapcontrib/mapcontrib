
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/admin/tag/tagColumn.ejs';


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
        list: '.rg_list',
    },

    ui: {
        column: '.column',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const listGroup = new ListGroup({
            collection: this.model.get('tags'),
            labelAttribute: 'key',
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
        this.options.router.navigate(`admin/tag/edit/${uuid}`, true);
    },
});
