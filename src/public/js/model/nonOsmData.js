
import Backbone from 'backbone';


export default Backbone.Model.extend({
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
