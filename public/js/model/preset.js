
import Backbone from 'backbone';
import 'backbone-relational';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            uuid: undefined,
            parentUuid: undefined,
            name: undefined,
            description: undefined,
            order: undefined,
            tags: [/*
                {
                    tag: '',
                    value: '',
                    keyReadOnly: false,
                    valueReadOnly: false,
                    nonOsmData: false,
                }
            */],
            locales: {/*
                fr: {
                    name: '',
                    description: '',
                }
            */},
        };
    },

    localizedAttributes: [
        'name',
        'description',
    ],

    initialize() {
        if (!this.get('uuid')) {
            this.set('uuid', uuid());
        }
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },

    getLocaleCompletion(localeCode) {
        const locale = this.get('locales')[localeCode];
        const data = {
            items: this.localizedAttributes.length,
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

        return data;
    },
});
