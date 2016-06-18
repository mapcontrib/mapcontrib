
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'value': '.value',
        'keyReadOnly': '.keyReadOnly',
        'valueReadOnly': '.valueReadOnly',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'onBlurKey',
        'blur @ui.value': 'onBlurValue',
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
            'disabled',
            !this.model.get('keyReadOnly')
        );

        this.ui.valueReadOnly.prop(
            'checked',
            this.model.get('valueReadOnly')
        );
    },

    onBlurKey: function (e) {
        this.model.set(
            'key',
            this.ui.key.val().trim()
        );
    },

    onBlurValue: function (e) {
        this.model.set(
            'value',
            this.ui.value.val().trim()
        );
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
