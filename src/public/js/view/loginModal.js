
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.LayoutView.extend({

    template: JST['loginModal.html'],

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

        this._radio = Backbone.Wreqr.radio.channel('global');
    },

    onBeforeOpen: function () {

        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    close: function () {

        this.triggerMethod('close');
    },
});
