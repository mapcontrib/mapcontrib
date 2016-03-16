
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../../../templates/templates');


module.exports = Marionette.ItemView.extend({

    template: JST['ui/form/presetNodeTags/listItem.html'],

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

        console.log('render');
        document.l10n.localizeNode( this.el );

        this.ui.keyReadOnly.prop(
            'checked',
            this.model.get('keyReadOnly')
        );

        this.ui.valueReadOnly.prop(
            'disabled',
            !this.model.get('keyReadOnly')
        );

        this.ui.valueReadOnly.prop(
            'checked',
            this.model.get('valueReadOnly')
        );
    },

    onChangeKey: function (e) {

        var value = this.ui.key.val().toLowerCase();

        this.ui.key.val(value);
        this.model.set('key', value);
    },

    onChangeValue: function (e) {

        this.model.set('value', this.ui.value.val());
    },

    onChangeKeyReadOnly: function (e) {

        this.model.set('keyReadOnly', this.ui.keyReadOnly.prop('checked'));

        this.ui.valueReadOnly.prop(
            'disabled',
            !this.model.get('keyReadOnly')
        );
    },

    onChangeValueReadOnly: function (e) {

        this.model.set('valueReadOnly', this.ui.valueReadOnly.prop('checked'));
    },

    onClickRemoveBtn: function (e) {

        this.model.destroy();
    },
});
