
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/loginModal.ejs'),

    behaviors: {

        'l20n': {},
        'modal': {},
    },

    ui: {

        'modal': '#login_modal',
    },

    templateHelpers: function () {

        return {

            'authCallback': '/theme-'+ this.options.fragment,
        };
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');
    },

    onBeforeOpen: function () {

        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    close: function () {

        this.triggerMethod('close');
    },
});
