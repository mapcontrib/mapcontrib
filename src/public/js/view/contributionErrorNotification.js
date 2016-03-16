

define([

    'underscore',
    'backbone',
    'backbone.marionette',
    'bootstrap',
    '../../templates/templates',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates
) {

    'use strict';

    return Marionette.LayoutView.extend({

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

            this._radio = Backbone.Wreqr.radio.channel('global');

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
});
