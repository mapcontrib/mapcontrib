
import _ from 'underscore';
import Backbone from 'backbone';
import CONST from '../const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'user',

    defaults: {
        'creationDate': new Date().toISOString(),
        'modificationDate': new Date().toISOString(),
        'osmId': undefined,
        'displayName': undefined,
        'avatar': undefined,
        'token': undefined,
        'tokenSecret': undefined,
    },

    updateModificationDate: function () {
        this.set('modificationDate', new Date().toISOString());
    },
});
