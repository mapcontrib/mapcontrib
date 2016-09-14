
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
            collection: this.model.get('presets'),
            reorderable: true,
            removeable: true,
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

        this.listenTo(listGroup, 'reorder', this.onReorder);
        this.listenTo(listGroup, 'item:remove', this.onRemove);
        this.listenTo(listGroup, 'item:select', this.onSelect);

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

    onReorder() {
        this.model.updateModificationDate();
        this.model.save();
    },

    onRemove() {
        this.model.save();
    },

    onSelect(model) {
        const uuid = model.get('uuid');
        this.options.router.navigate(`admin/preset/${uuid}`, true);
    },
});
