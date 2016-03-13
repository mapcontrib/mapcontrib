

define([

    'backbone',
    'ui/form/navPillsStacked/model',
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
