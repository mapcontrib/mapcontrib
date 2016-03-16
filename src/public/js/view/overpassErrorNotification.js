

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

    return Marionette.ItemView.extend({

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

            this._radio = Backbone.Wreqr.radio.channel('global');

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

                document.l10n.getSync('overpassErrorNotification_content', { 'name': this.model.get('name') })
            );
        },
    });
});
