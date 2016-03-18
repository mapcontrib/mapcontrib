
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.LayoutView.extend({

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
