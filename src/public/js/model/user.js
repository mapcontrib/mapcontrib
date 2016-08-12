
import _ from 'underscore';
import Backbone from 'backbone';
import CONST from '../const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'user',

    defaults() {
        return {
            'creationDate': new Date().toISOString(),
            'modificationDate': new Date().toISOString(),
            'osmId': undefined,
            'displayName': undefined,
            'avatar': undefined,
            'token': undefined,
            'tokenSecret': undefined,
        };
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },
});
