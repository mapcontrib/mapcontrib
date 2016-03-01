

define([

    'backbone',
    'ui/form/nodeTags/nodeTagsModel',
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
