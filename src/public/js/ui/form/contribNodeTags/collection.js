

define([

    'backbone',
    './model',
],
function (

    Backbone,
    ContribNodeTagsModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: ContribNodeTagsModel,
    });
});
