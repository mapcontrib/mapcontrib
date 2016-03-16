

define([

    'backbone',
    './model',
],
function (

    Backbone,
    NavPillsStackedModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: NavPillsStackedModel,
    });
});
