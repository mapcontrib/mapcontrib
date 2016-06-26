
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'value': '.value',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.value': 'updateValue',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.value': 'updateValue',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers: function () {
        return {
            'cid': this.model.cid
        };
    },

    onRender: function () {
        document.l10n.localizeNode( this.el );

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

    updateKey: function (e) {
        this.model.set(
            'key',
            this.ui.key.val().trim()
        );
    },

    updateValue: function (e) {
        this.model.set(
            'value',
            this.ui.value.val().trim()
        );
    },

    onClickRemoveBtn: function (e) {
        this.model.destroy();
    },
});
