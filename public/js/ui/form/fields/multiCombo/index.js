
import Marionette from 'backbone.marionette';
import Locale from 'core/locale';
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
        'change @ui.select': '_onChangeSelect',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers() {
        const placeholder = this.options.placeholder || document.l10n.getSync('value');

        return {
            placeholder,
        };
    },

    onRender() {
        this.ui.select.selectize({
            maxItems: null,
            create: false,
            plugins: ['remove_button'],
            valueField: 'value',
            labelField: 'label',
            searchField: ['label', 'value'],
            options: this._buildOptions(),
        });
    },

    _buildOptions() {
        const key = this.model.get('key');
        const customTag = this.options.customTags.findWhere({ key });
        const iDTag = this.options.iDPresetsHelper.getField(key);

        if (customTag) {
            return this._buildOptionsFromCustomTag(
                Locale.getLocalizedOptions(customTag)
            );
        }

        if (iDTag) {
            return iDTag.options;
        }

        return [];
    },

    _buildOptionsFromCustomTag(localizedOptions) {
        const options = [];
        const key = this.model.get('key');

        for (const option in localizedOptions) {
            if ({}.hasOwnProperty.call(localizedOptions, option)) {
                options.push({
                    label: localizedOptions[option],
                    value: `${key}:${option}`,
                });
            }
        }

        return options;
    },

    _onChangeSelect() {
        // this.model.set(
        //     'value',
        //     this.ui.select.val().trim()
        // );
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
