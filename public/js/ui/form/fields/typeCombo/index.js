
import Marionette from 'backbone.marionette';
import Locale from 'core/locale';
import template from './template.ejs';


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
        'change @ui.select': '_onChangeSelect',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    onRender() {
        const options = this._findTagOptions();
        const yes = document.l10n.getSync('yes');
        let html = '<option value=""></option>';
        html += `<option value="yes">${yes}</option>`;

        for (const value in options) {
            if ({}.hasOwnProperty.call(options, value)) {
                html += `<option value="${value}">${options[value]}</option>`;
            }
        }

        this.ui.select.html(html);

        this.ui.select.val(
            this.model.get('value')
        );
    },

    _findTagOptions() {
        const key = this.model.get('key');
        const customTag = this.options.customTags.findWhere({ key });
        const iDTag = this.options.iDPresetsHelper.getField(key);

        if (customTag) {
            return Locale.getLocalizedOptions(customTag);
        }

        if (iDTag) {
            return iDTag.options;
        }

        return [];
    },

    _onChangeSelect() {
        this.model.set(
            'value',
            this.ui.select.val()
        );
    },

    onClickRemoveBtn() {
        this.model.destroy();
    },

    enable() {
        this.ui.select.prop('disabled', false);
    },

    disable() {
        this.ui.select.prop('disabled', true);
    },

    enableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', false);
    },

    disableRemoveBtn() {
        this.ui.removeBtn.prop('disabled', true);
    },

    setFocus() {
        this.ui.select.focus();
    },
});
