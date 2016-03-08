

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

        template: JST['ui/form/contribNodeTags/listItem.html'],

        ui: {

            'key': '.key',
            'value': '.value',
            'removeBtn': '.remove_btn',
        },

        events: {

            'change @ui.key': 'onChangeKey',
            'change @ui.value': 'onChangeValue',
            'click @ui.removeBtn': 'onClickRemoveBtn',
        },

        templateHelpers: function () {

            return {
                'cid': this.model.cid
            };
        },

        onRender: function () {

            document.l10n.localizeNode( this.el );
        },

        onChangeKey: function (e) {

            this.model.set('key', this.ui.key.val());
        },

        onChangeValue: function (e) {

            this.model.set('value', this.ui.value.val());
        },

        onClickRemoveBtn: function (e) {

            this.model.destroy();
        },
    });
});
