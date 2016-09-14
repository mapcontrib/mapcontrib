
import _ from 'underscore';
import Backbone from 'backbone';
import 'backbone-relational';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            uuid: undefined,
            name: undefined,
            description: undefined,
            order: undefined,
            fields: [/*
                {
                    field: '',
                    nonOsmData: false,
                }
            */],
            tags: [/*
                {
                    tag: '',
                    value: '',
                    keyReadOnly: false,
                    valueReadOnly: false,
                    nonOsmData: false,
                    type: 'text'|'file'
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

    initialize() {
        if (!this.get('uuid')) {
            this.set('uuid', uuid());
        }
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },
});
