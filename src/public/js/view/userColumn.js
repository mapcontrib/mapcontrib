

define([

    'underscore',
    'backbone',
    'backbone.marionette',
    '../../templates/templates',
],
function (

    _,
    Backbone,
    Marionette,
    templates
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['userColumn.html'],

        behaviors: {

            'l20n': {},
            'column': {},
        },

        ui: {

            'column': '#user_column',
            'logoutItem': '.logout_item',
        },

        events: {

            'click @ui.logoutItem': 'close',
        },

        initialize: function () {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');
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
