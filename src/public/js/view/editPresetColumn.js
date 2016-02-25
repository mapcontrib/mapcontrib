

define([

    'underscore',
    'backbone',
    'marionette',
    'bootstrap',
    'templates',
    'const',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    CONST
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['editPresetColumn.html'],
        templateListItem: JST['presetListItem.html'],

        behaviors: {

            'l20n': {},
            'column': {},
        },

        ui: {

            'column': '#edit_preset_column',
            'presetList': '.preset_list',
            'presets': '.preset_list input',
        },

        events: {

            'submit': 'onSubmit',
            'reset': 'onReset',
        },

        initialize: function () {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');

            this._oldModel = this.model.clone();
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
});
