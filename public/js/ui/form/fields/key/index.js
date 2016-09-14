
import Marionette from 'backbone.marionette';
import template from './template.ejs';
import 'typeahead.js';
import 'typeahead.js-bootstrap-css/typeaheadjs.css';


export default Marionette.ItemView.extend({
    template,

    ui: {
        'key': '.key',
        'tagInfoBtn': '.tag_info_btn',
    },

    templateHelpers() {
        const key = this.model.get('key');
        const label = this.options.iDPresetsHelper.getLocalizedFieldLabel(key) || key;

        return {
            label,
            placeholder: document.l10n.getSync('uiFormNodeTags_key'),
        };
    },

    onRender() {
        document.l10n.localizeNode( this.el );

        this.renderTagInfo();

        if ( this.model.get('keyReadOnly') === false ) {
            this._proposedFields = this.options.iDPresetsHelper.buildFieldsForTypeahead();

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
        }
    },

    _substringMatcher(proposedFields) {
        return function findMatches(query, callback) {
            const substrRegex = new RegExp(query, 'i');

            const matches = proposedFields.filter(field => {
                if (substrRegex.test(field.label)) {
                    return true;
                }

                return false;
            });

            callback(matches);
        };
    },

    renderTagInfo() {
        const key = this.model.get('key');
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.tagInfoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    _updateKey(key) {
        let isProposedField = false;

        for (const field of this._proposedFields) {
            if (key.toLowerCase() === field.label.toLowerCase()) {
                this.model.set('key', field.key);
                isProposedField = true;
            }
        }

        if (isProposedField === false) {
            this.model.set( 'key', key );
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
