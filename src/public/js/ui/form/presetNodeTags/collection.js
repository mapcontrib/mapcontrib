

define([

    'backbone',
    './model',
],
function (

    Backbone,
    PresetNodeTagsModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: PresetNodeTagsModel,
    });
});
