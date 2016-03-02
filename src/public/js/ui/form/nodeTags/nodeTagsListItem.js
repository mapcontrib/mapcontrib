

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

            'key': '.key',
            'value': '.value',
            'keyReadOnly': '.keyReadOnly',
            'valueReadOnly': '.valueReadOnly',
            'removeBtn': '.remove_btn',
        },

        events: {

            'change @ui.key': 'onChangeKey',
            'change @ui.value': 'onChangeValue',
            'change @ui.keyReadOnly': 'onChangeKeyReadOnly',
            'change @ui.valueReadOnly': 'onChangeValueReadOnly',
            'click @ui.removeBtn': 'onClickRemoveBtn',
        },

        templateHelpers: function () {

            return {
                'cid': this.model.cid
            };
        },

        onRender: function () {

            document.l10n.localizeNode( this.el );

            this.ui.keyReadOnly.prop(
                'checked',
                this.model.get('keyReadOnly')
            );

            this.ui.valueReadOnly.prop(
                'checked',
                this.model.get('valueReadOnly')
            );
        },

        onChangeKey: function (e) {

            this.model.set('key', this.ui.key.val());
        },

        onChangeValue: function (e) {

            this.model.set('value', this.ui.value.val());
        },

        onChangeKeyReadOnly: function (e) {

            this.model.set('keyReadOnly', this.ui.keyReadOnly.prop('checked'));
        },

        onChangeValueReadOnly: function (e) {

            this.model.set('valueReadOnly', this.ui.valueReadOnly.prop('checked'));
        },

        onClickRemoveBtn: function (e) {

            this.model.destroy();
        },
    });
});
