

define([

    'underscore',
    'backbone',
    '../settings',
],
function (

    _,
    Backbone,
    settings
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            'lat': undefined,
            'lng': undefined,
            'tags': [], // [{'key': '', 'value': ''}, [...]]
        }
    });
});
