
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/zoomNotification.ejs'),

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

        this._radio = Wreqr.radio.channel('global');
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },
});
