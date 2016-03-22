
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/conflictModal.ejs'),

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
