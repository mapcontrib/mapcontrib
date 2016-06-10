
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import EditLayerListView from './editLayerList';
import template from '../../templates/editPoiColumn.ejs';


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
        'column': '#edit_poi_column',
        'addButton': '.add_btn',
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender: function () {
        var layers = this._radio.reqres.request('layers'),
        editLayerListView = new EditLayerListView({ 'collection': layers });

        this.getRegion('layerList').show( editLayerListView );
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onClickAdd: function () {
        this._radio.commands.execute('column:showLayer');
    },
});
