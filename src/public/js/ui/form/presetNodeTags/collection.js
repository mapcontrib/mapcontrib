

define([

    'backbone',
    'ui/form/presetNodeTags/model',
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
