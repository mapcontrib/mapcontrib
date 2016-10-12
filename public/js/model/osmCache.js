
import Backbone from 'backbone';
import CONST from 'const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: `${CONST.apiPath}/osmCache`,

    defaults() {
        return {
            creationDate: new Date().toISOString(),
            modificationDate: new Date().toISOString(),
            osmId: undefined,
            osmType: undefined,
            osmVersion: 0,
            osmElement: undefined,
            overPassElement: undefined,
            userId: undefined,
            themeFragment: undefined,
        };
    },

    initialize() {
        this.on('change:osmId', this.setInt.bind(this, 'osmId'));
        this.on('change:osmVersion', this.setInt.bind(this, 'osmVersion'));
        this.on('change:userId', this.setInt.bind(this, 'userId'));

        this.set('osmId', parseInt(this.get('osmId'), 10));
        this.set('osmVersion', parseInt(this.get('osmVersion'), 10));
        this.set('userId', parseInt(this.get('userId'), 10));
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },

    setInt(attributeName, model, value) {
        this.set(attributeName, parseInt(value, 10));
    },
});
