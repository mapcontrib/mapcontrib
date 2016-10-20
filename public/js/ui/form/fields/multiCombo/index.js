
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
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers() {
        const placeholder = this.options.placeholder || document.l10n.getSync('value');

        return {
            placeholder,
        };
    },

    onRender() {
        this._selectize = this.ui.select.selectize({
            maxItems: null,
            create: false,
            plugins: ['remove_button'],
            valueField: 'value',
            labelField: 'label',
            searchField: ['label', 'value'],
            options: this._buildOptions(),
            onChange: this._onChangeSelect.bind(this),
        })[0].selectize;

        this._selectize.setValue(
            this.model.get('options')
        );
    },

    _buildOptions() {
        const key = this.model.get('key');
        const customTag = this.options.customTags.findWhere({ key });

        if (customTag) {
            return this._buildOptionsFromCustomTag(
                Locale.getLocalizedOptions(customTag)
            );
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

    _onChangeSelect(options) {
        this.model.set('options', options);
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
