

define([

    'backbone',
    'ui/form/contribNodeTags/model',
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
