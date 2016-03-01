

define([

    'underscore',
    'backbone',
    'marionette',
    'bootstrap',
    'templates',
    'model/preset',
    'view/editPresetList',
    'view/editPresetTagsColumn',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    PresetModel,
    EditPresetListView,
    EditPresetTagsColumnView
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['editPresetColumn.html'],

        behaviors: {

            'l20n': {},
            'column': {},
        },

        regions: {

            'presetList': '.rg_preset_list',
        },

        ui: {

            'column': '#edit_preset_column',
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

            var presets = this._radio.reqres.request('presets'),
            editPresetListView = new EditPresetListView({ 'collection': presets });

            this.getRegion('presetList').show( editPresetListView );
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

            this._radio.commands.execute('column:showPresetTags');
        },
    });
});
