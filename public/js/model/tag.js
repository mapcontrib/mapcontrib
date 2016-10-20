
import Backbone from 'backbone';
import 'backbone-relational';
import CONST from '../const';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            uuid: undefined,
            key: undefined,
            type: CONST.tagType.text,
            options: [],
            order: undefined,

            locales: {/*
                fr: {
                    key: '',
                    options: [],
                }
            */},
        };
    },

    localizedAttributes: [
        'key',
    ],

    initialize() {
        if (!this.get('uuid')) {
            this.set('uuid', uuid());
        }
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },

    isComboField() {
        return [
            CONST.tagType.combo,
            CONST.tagType.typeCombo,
            CONST.tagType.multiCombo,
        ].indexOf(this.get('type')) > -1;
    },

    getLocaleCompletion(localeCode) {
        const options = this.get('options');
        const locale = this.get('locales')[localeCode];
        const data = {
            items: this.localizedAttributes.length + options.length,
            completed: 0,
        };

        if (!locale) {
            return data;
        }

        for (const attribute of this.localizedAttributes) {
            if (locale[attribute]) {
                data.completed += 1;
            }
        }

        if (this.isComboField()) {
            for (const option of options) {
                if (locale.options && locale.options[option]) {
                    data.completed += 1;
                }
            }
        }

        return data;
    },
});
