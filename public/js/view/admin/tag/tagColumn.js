
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ListGroup from 'ui/listGroup';
import template from 'templates/admin/tag/tagColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors() {
        return {
            'l20n': {},
            'column': {
                'appendToBody': true,
                'destroyOnClose': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    regions: {
        'list': '.rg_list',
    },

    ui: {
        'column': '.column',
        'addButton': '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const listGroup = new ListGroup({
            collection: this.model.get('tags'),
            reorderable: true,
            removeable: true,
            placeholder: document.l10n.getSync('uiListGroup_placeholder'),
        });

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

    onClickAdd() {
        this.close();
        this.options.router.navigate('admin/tag/new', true);
    },
});
