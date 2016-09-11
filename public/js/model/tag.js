
import Backbone from 'backbone';
import 'backbone-relational';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            uniqid: undefined,
            name: undefined,
            description: undefined,
            order: undefined,
            iDPreset: undefined,
            tags: [
            /*{
                key: '',
                value: '',
                keyReadOnly: false,
                valueReadOnly: false,
                nonOsmData: false,
                type: 'text'|'file'
            }*/
            ],
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
