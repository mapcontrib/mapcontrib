
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SelectLayerListView from './selectLayerList';
import template from '../../templates/selectLayerColumn.ejs';


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
        'column': '#select_poi_column',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        this._radio.commands.setHandler('column:selectLayer:render', this.render.bind(this));
    },

    onRender: function () {
        var layers = this.model.get('layers'),
        selectLayerListView = new SelectLayerListView({ 'collection': layers });

        this.getRegion('layerList').show( selectLayerListView );
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
});
