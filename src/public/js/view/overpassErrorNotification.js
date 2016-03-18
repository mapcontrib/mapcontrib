
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.ItemView.extend({

    template: JST['overpassErrorNotification.html'],

    behaviors: {

        'l20n': {},
        'notification': {

            'destroyOnClose': true,
        },
    },

    ui: {

        'notification': '.notification',

        'content': '.content',
    },

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');

        return this.render();
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },

    onRender: function () {

        this.ui.content.html(

            // document.l10n.getSync('overpassErrorNotification_content', { 'name': this.model.get('name') })
        );
    },
});
