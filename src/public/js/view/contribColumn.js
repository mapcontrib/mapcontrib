

define([

    'underscore',
    'backbone',
    'marionette',
    'bootstrap',
    'templates',
    'leaflet',
    'osm-auth',
    'helper/osmEdit',
    'ui/map',
    'const',
    'settings',
    'model/poiLayer',
    'ui/form/contribNodeTags/list',
    'ui/form/navPillsStacked/list'
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    L,
    osmAuth,
    OsmEditHelper,
    MapUi,
    CONST,
    settings,
    PoiLayerModel,
    ContribNodeTagsList,
    NavPillsStackedList
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['contribColumn.html'],

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

            this._radio = Backbone.Wreqr.radio.channel('global');
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
            presetsNav = new NavPillsStackedList(),
            freeAdditionNav = new NavPillsStackedList(),
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
});
