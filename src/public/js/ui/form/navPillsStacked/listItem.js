

define([

    'underscore',
    'backbone',
    'marionette',
    'templates',
],
function (

    _,
    Backbone,
    Marionette,
    templates
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: JST['ui/form/navPillsStacked/listItem.html'],

        tagName: 'li',

        attributes: {

            'role': 'presentation',
        },

        ui: {

            'link': 'a',
        },

        events: {

            'click @ui.link': 'onClick'
        },

        onClick: function (e) {

            var callback = this.model.get('callback');

            if (callback) {

                callback();
            }
        }
    });
});
