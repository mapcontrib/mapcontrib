
var Marionette = require('backbone.marionette');
var PresetNodeTagsCollection = require('./collection');
var PresetNodeTagsListItemView = require('./listItem');


module.exports = Marionette.CollectionView.extend({

    childView: PresetNodeTagsListItemView,

    setTags: function (tags) {

        this.collection = new PresetNodeTagsCollection( tags );

        if (tags.length === 0) {

            this.collection.add({});
        }

        this.render();
    },

    addTag: function () {

        this.collection.add({});
    },

    getTags: function () {

        return this.collection.toJSON();
    },
});
