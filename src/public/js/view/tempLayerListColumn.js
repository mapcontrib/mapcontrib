
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import TempLayerListView from './tempLayerList';
import template from '../../templates/tempLayerListColumn.ejs';



export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'layerList': '.rg_layer_list',
    },

    ui: {
        'column': '#temp_layer_column',
        'addButton': '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        const tempLayerListView = new TempLayerListView({
            'collection': this.collection,
        });

        this.getRegion('layerList').show( tempLayerListView );
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
        this._radio.commands.execute('column:showAddTempLayerMenu');
    },
});
