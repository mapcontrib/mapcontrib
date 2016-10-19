
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/admin/locale/tagEditColumn.ejs';
import templateOption from 'templates/admin/locale/tagOption.ejs';


export default Marionette.LayoutView.extend({
    template,
    templateOption,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.routeOnClose,
                triggerRouteOnClose: this.options.triggerRouteOnClose,
            },
        };
    },

    ui: {
        column: '.column',
        tagKey: '#tag_key',
        optionsSection: '.options_section',
    },

    events: {
        submit: 'onSubmit',
        reset: 'onReset',
    },

    templateHelpers() {
        const attributes = this.model.get('locales')[this.options.locale] || {};

        return {
            key: attributes.key || '',
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onRender() {
        switch (this.model.get('type')) {
            case CONST.tagType.combo:
            case CONST.tagType.typeCombo:
            case CONST.tagType.multiCombo:
                this._renderOptions();
                break;
            default:
        }
    },

    _renderOptions() {
        const key = this.model.get('key');
        const options = this.model.get('options');
        const attributes = this.model.get('locales')[this.options.locale] || {};
        let optionHtml = '';

        for (const option of options) {
            const inputId = `${key}_${option}_${this.model.cid}`;
            let optionLabel = `${option}`;
            let value = '';

            if (this.model.get('type') === CONST.tagType.multiCombo) {
                optionLabel = `${key}:${option}`;
            }

            if (attributes.options && attributes.options[option]) {
                value = attributes.options[option];
            }

            optionHtml += this.templateOption({
                id: inputId,
                label: optionLabel,
                value,
            });
        }

        this.ui.optionsSection.html(optionHtml);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onSubmit(e) {
        e.preventDefault();

        const key = this.model.get('key');
        const options = this.model.get('options');
        const locale = {
            key: this.ui.tagKey.val().trim(),
            options: {},
        };

        for (const option of options) {
            const inputId = `${key}_${option}_${this.model.cid}`;
            const value = this.el.querySelector(`#${inputId}`).value;
            locale.options[option] = value;
        }

        const locales = this.model.get('locales');
        locales[this.options.locale] = locale;

        this.model.set('locales', locales);

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => {
                this.close();
            },

            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset() {
        this.close();
    },
});
