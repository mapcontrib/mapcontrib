
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../../../templates/templates');


module.exports = Marionette.ItemView.extend({

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

    templateHelpers: function () {

        return {

            'description': markdown.toHTML( this.model.get('description') ),
        };
    },

    onClick: function (e) {

        var callback = this.model.get('callback');

        if (callback) {

            callback();
        }
    }
});
