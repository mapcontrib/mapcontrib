

define([

    'underscore',
    'backbone',
    '../settings',
    '../model/user',
],
function (

    _,
    Backbone,
    settings,
    UserModel
) {

    'use strict';

    return Backbone.Collection.extend({

        url: settings.apiPath + 'user',

        model: UserModel,

        comparator: 'displayName',
    });
});
