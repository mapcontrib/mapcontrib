
import _ from 'underscore';
import Backbone from 'backbone';
import CONST from '../const';
import { uuid } from '../core/utils';


export default Backbone.Model.extend({
    defaults: {
        'creationDate': new Date().toISOString(),
        'modificationDate': new Date().toISOString(),
        'uniqid': undefined,
        'name': undefined,
        'description': undefined,
        'order': undefined,
        'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
    },

    initialize: function () {
        if (!this.get('uniqid')) {
            this.set('uniqid', uuid());
        }
    },

    updateModificationDate: function () {
        this.set('modificationDate', new Date().toISOString());
    },
});
