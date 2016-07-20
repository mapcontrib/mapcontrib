
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
        this.getRegion('layerList').show(
            new SelectLayerListView({ 'collection': this.collection })
        );
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
});
