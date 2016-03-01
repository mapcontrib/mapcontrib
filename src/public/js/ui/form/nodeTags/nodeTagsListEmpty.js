

define([

    'marionette',
],
function (

    Marionette
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: JST['ui/form/nodeTags/nodeTagsListEmpty.html'],
    });
});
