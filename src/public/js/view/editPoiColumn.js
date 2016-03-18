
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');
var EditPoiLayerListView = require('./editPoiLayerList');


module.exports = Marionette.LayoutView.extend({

    template: JST['editPoiColumn.html'],

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

        var self = this;

        this._radio = Backbone.Wreqr.radio.channel('global');
    },

    onRender: function () {

        var poiLayers = this._radio.reqres.request('poiLayers'),
        editPoiLayerListView = new EditPoiLayerListView({ 'collection': poiLayers });

        this.getRegion('layerList').show( editPoiLayerListView );
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

        this._radio.commands.execute('column:showPoiLayer');
    },
});
