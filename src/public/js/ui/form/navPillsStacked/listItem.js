
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var marked = require('marked');


module.exports = Marionette.ItemView.extend({

    template: require('./listItem.ejs'),

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

            'description': marked( this.model.get('description') ),
        };
    },

    onClick: function (e) {

        var callback = this.model.get('callback');

        if (callback) {

            callback();
        }
    }
});
