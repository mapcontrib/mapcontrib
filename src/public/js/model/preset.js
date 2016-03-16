

define([

    'underscore',
    'backbone',
    '../settings',
    '../const',
],
function (

    _,
    Backbone,
    settings,
    CONST
) {

    'use strict';

    return Backbone.Model.extend({

        idAttribute: '_id',

        urlRoot: settings.apiPath + 'preset',

        defaults: {

            'themeId': undefined,
            'name': undefined,
            'description': undefined,
            'order': undefined,
            'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
        },
    });
});
