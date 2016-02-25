

define([

    'underscore',
    'backbone',
    'settings',
    'model/user',
],
function (

    _,
    Backbone,
    settings,
    userModel
) {

    'use strict';

    return Backbone.Collection.extend({

        url: settings.apiPath + 'user',

        model: userModel,

        comparator: 'displayName',
    });
});
