

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

    return Marionette.ItemView.extend({

        template: JST['editPresetListEmpty.html'],
    });
});
