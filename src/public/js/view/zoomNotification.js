

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

        template: JST['zoomNotification.html'],

        behaviors: {

            'l20n': {},
            'notification': {},
        },

        ui: {

            'notification': '#zoom_notification',

            'content': '.content',
        },

        initialize: function () {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');
        },

        open: function () {

            this.triggerMethod('open');
        },

        close: function () {

            this.triggerMethod('close');
        },
    });
});
