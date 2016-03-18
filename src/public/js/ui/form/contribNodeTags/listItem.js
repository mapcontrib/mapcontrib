
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');


module.exports = Marionette.ItemView.extend({

    template: require('./listItem.ejs'),

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

        // document.l10n.localizeNode( this.el );

        if (this.model.get('keyReadOnly')) {

            this.ui.key.prop('disabled', 'disabled');
        }

        if (this.model.get('valueReadOnly')) {

            this.ui.value.prop('disabled', 'disabled');
        }

        if (this.model.get('keyReadOnly') || this.model.get('valueReadOnly')) {

            this.ui.removeBtn.prop('disabled', 'disabled');
        }
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
