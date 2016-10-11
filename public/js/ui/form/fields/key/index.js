
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from './template.ejs';
import 'typeahead.js';
import 'typeahead.js-bootstrap-css/typeaheadjs.css';


export default Marionette.ItemView.extend({
    template,

    ui: {
        key: '.key',
        tagInfoBtn: '.tag_info_btn',
    },

    events: {
        'keydown @ui.key': '_onKeyDown',
    },

    templateHelpers() {
        const key = this.model.get('key');
        let label = this.options.customTags.getLocalizedTypeaheadFieldLabel(key);

        if (!label) {
            label = this.options.iDPresetsHelper.getLocalizedTypeaheadFieldLabel(key);
        }

        if (!label) {
            label = key;
        }

        return {
            label,
            placeholder: document.l10n.getSync('key'),
        };
    },

    onRender() {
        this.renderTagInfo();

        this._proposedFields = [
            ...this.options.customTags.getFieldsForTypeahead(),
            ...this.options.iDPresetsHelper.getFieldsForTypeahead(),
        ];

        this.ui.key.typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1,
            },
            {
                name: 'fields',
                source: this._substringMatcher(this._proposedFields),
                display: 'label',
            }
        )
        .on('typeahead:change', (e, key) => {
            this._updateKey(key.trim());
        });
    },

    _substringMatcher(proposedFields) {
        return function findMatches(query, callback) {
            try {
                const substrRegex = new RegExp(query, 'i');

                const matches = proposedFields.filter((field) => {
                    if (substrRegex.test(field.label)) {
                        return true;
                    }

                    if (substrRegex.test(field.key)) {
                        return true;
                    }

                    return false;
                });

                callback(matches);
            }
            catch (e) {
                callback([]);
            }
        };
    },

    renderTagInfo() {
        const key = this.model.get('key');
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.tagInfoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    _onKeyDown() {
        this._updateKey(this.ui.key.val().trim());
    },

    _updateKey(key) {
        let isProposedField = false;

        for (const field of this._proposedFields) {
            if (key.toLowerCase() === field.label.toLowerCase()) {
                this.model.set('key', field.key);
                this.model.set('type', field.type);
                isProposedField = true;
            }
        }

        if (isProposedField === false) {
            this.model.set('key', key);
            this.model.set('type', CONST.tagType.text);
        }

        this.trigger('change', this.model.get('key'));

        this.renderTagInfo();
    },

    enable() {
        this.ui.key.prop('disabled', false);
    },

    disable() {
        this.ui.key.prop('disabled', true);
    },

    setFocus() {
        if (this.ui.key.focus) {
            this.ui.key.focus();
        }
    },
});
