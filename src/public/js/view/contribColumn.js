
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var L = require('leaflet');
var osmAuth = require('osm-auth');
var OsmEditHelper = require('../helper/osmEdit');
var MapUi = require('../ui/map');
var CONST = require('../const');
var settings = require('../settings');
var PoiLayerModel = require('../model/poiLayer');
var NavPillsStackedListView = require('../ui/form/navPillsStacked/list');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/contribColumn.ejs'),

    behaviors: {

        'l20n': {},
        'column': {},
    },

    regions: {

        'presetsNav': '.rg_presets_nav',
        'freeAdditionNav': '.rg_free_addition_nav',
    },

    ui: {

        'column': '#contrib_column',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');
    },

    setModel: function (model) {

        this.model = model;

        this.render();
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

    onRender: function () {

        var presetNavItems = [],
        presetsNav = new NavPillsStackedListView(),
        freeAdditionNav = new NavPillsStackedListView(),
        presetModels = this._radio.reqres.request('presets').models;

        for (var key in presetModels) {
            if (presetModels.hasOwnProperty(key)) {
                presetNavItems.push({
                    'label': presetModels[key].get('name'),
                    'description': presetModels[key].get('description'),
                    'callback': this._radio.commands.execute.bind(
                        this._radio.commands,
                        'column:showContribForm',
                        {
                            'model': this.model,
                            'presetModel': presetModels[key]
                        }
                    )
                });
            }
        }

        presetsNav.setItems(presetNavItems);

        freeAdditionNav.setItems([{

            'label': document.l10n.getSync('contribColumn_freeAddition'),
            'callback': this._radio.commands.execute.bind(
                this._radio.commands,
                'column:showContribForm',
                {
                    'model': this.model
                }
            )
        }]);

        this.getRegion('presetsNav').show( presetsNav );
        this.getRegion('freeAdditionNav').show( freeAdditionNav );
    },
});
