
import Marionette from 'backbone.marionette';
import template from './template.ejs';
import 'selectize';
import 'selectize/dist/css/selectize.css';
import 'selectize/dist/css/selectize.bootstrap3.css';


export default Marionette.ItemView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
        };
    },

    ui: {
        select: '.form-control',
        removeBtn: '.remove_btn',
    },

    events: {
        'change @ui.input': 'updateInput',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers() {
        const placeholder = this.options.placeholder || document.l10n.getSync('value');

        return {
            placeholder,
        };
    },

    onShow() {
        this.ui.select.selectize({
            create: true,
            sortField: 'text',
        });
    },

    updateInput() {
        this.model.set(
            'value',
            this.ui.input.val().trim()
        );
    },

    onClickRemoveBtn() {
        this.model.destroy();
    },

    enable() {
        this.ui.input.prop('disabled', false);
    },

    disable() {
        this.ui.input.prop('disabled', true);
    },

    enableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', false);
    },

    disableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', true);
    },

    setFocus() {
        this.ui.input.focus();
    },
});
