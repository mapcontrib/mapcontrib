
import Backbone from 'backbone';
import CONST from '../const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'nonOsmData',

    defaults: {
        'creationDate': new Date().toISOString(),
        'modificationDate': new Date().toISOString(),
        'osmId': undefined,
        'osmType': undefined,
        'userId': undefined,
        'themeFragment': undefined,
        'tags': [], // { key: string, value: string, type: text|img }
    },

    updateModificationDate: function () {
        this.set('modificationDate', new Date().toISOString());
    },
});
