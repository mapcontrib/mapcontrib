
import Marionette from 'backbone.marionette';
import template from './template.ejs';
import WidgetUi from 'ui/widget';


export default Marionette.ItemView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
        };
    },

    ui: {
        input: '.form-control',
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
        WidgetUi.setFocus(this.ui.input);
    },
});
