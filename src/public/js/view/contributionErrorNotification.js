
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.LayoutView.extend({

    template: JST['contributionErrorNotification.html'],

    behaviors: {

        'l20n': {},
        'notification': {

            'destroyOnClose': true,
        },
    },

    ui: {

        'notification': '.notification',

        'content': '.content',

        'retryButton': '.retry_btn',
    },

    events: {

        'click @ui.retryButton': 'onClickRetry',
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

    onClickRetry: function () {

        this.options.retryCallback();

        this.close();
    },
});
