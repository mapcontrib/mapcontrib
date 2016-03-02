

define([

    'backbone',
    'ui/form/nodeTags/model',
],
function (

    Backbone,
    NodeTagsModel
) {

    'use strict';

    return Backbone.Collection.extend({

        model: NodeTagsModel,
    });
});
