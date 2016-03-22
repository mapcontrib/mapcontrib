
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/userColumn.ejs'),

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

        this._radio = Wreqr.radio.channel('global');
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
