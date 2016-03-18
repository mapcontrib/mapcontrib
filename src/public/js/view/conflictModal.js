
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.LayoutView.extend({

    template: JST['conflictModal.html'],

    behaviors: {

        'l20n': {},
        'modal': {},
    },

    ui: {

        'modal': '#conflict_modal',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');
    },

    close: function () {

        this.triggerMethod('close');
    },
});
