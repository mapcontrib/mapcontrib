
import Backbone from 'backbone';
import CONST from '../const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'osmCache',

    defaults: {
        'creationDate': new Date().toISOString(),
        'modificationDate': new Date().toISOString(),
        'osmId': undefined,
        'osmType': undefined,
        'osmVersion': 0,
        'osmElement': undefined,
        'osmOverPassElement': undefined,
        'userId': undefined,
        'themeFragment': undefined,
    },

    updateModificationDate: function () {
        this.set('modificationDate', new Date().toISOString());
    },
});
