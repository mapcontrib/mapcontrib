
import Backbone from 'backbone';
import 'backbone-relational';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            uuid: undefined,
            key: undefined,
            value: undefined,
            order: undefined,
            locales: {/*
                fr: {
                    label: '',
                    placeholder: '',
                    options: {},
                }
            */},
        };
    },

    initialize() {
        if (!this.get('uniqid')) {
            this.set('uniqid', uuid());
        }
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },
});
