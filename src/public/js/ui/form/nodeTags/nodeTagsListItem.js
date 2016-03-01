

define([

    'underscore',
    'backbone',
    'marionette',
    'templates',
],
function (

    _,
    Backbone,
    Marionette,
    templates
) {

    'use strict';

    return Marionette.ItemView.extend({

        template: JST['ui/form/nodeTags/nodeTagsListItem.html'],

        ui: {

            'removeBtn': '.remove_btn',
        },

        events: {

            'click @ui.removeBtn': 'onClickRemoveBtn',
        },

        onClickRemoveBtn: function (e) {

            this.model.destroy();
        },

        onRender: function () {

            document.l10n.localizeNode( this.el );
        },
    });
});
