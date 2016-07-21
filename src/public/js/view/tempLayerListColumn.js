
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

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender: function () {
        var layers = this.model.get('layers'),
        tempLayerListView = new TempLayerListView({
            'collection': layers,
            'theme': this.model
        });

        this.getRegion('layerList').show( tempLayerListView );
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onClickAdd: function () {
        this._radio.commands.execute('column:showAddTempLayerMenu');
    },
});
