
import Marionette from 'backbone.marionette';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ContribNodeTagsListItemView,

    initialize: function () {
        this.collection = new ContribNodeTagsCollection();
    },

    setTags: function (tags) {
        if (tags.length === 0) {
            this.collection.add({
                'keyReadOnly': false,
                'valueReadOnly': false
            });
        }
        else {
            this.collection.add( tags );
        }

        this.render();
    },

    addTag: function (tag) {
        if ( !tag ) {
            tag = {
                'keyReadOnly': false,
                'valueReadOnly': false
            };
        }

        this.collection.add( tag );
    },

    getTags: function () {
        let rawTags = this.collection.toJSON();
        let tags = {};

        for (let tag of rawTags) {
            if (!tag.key || !tag.value) {
                continue;
            }

            tags[tag.key] = tag.value;
        }

        return tags;
    },
});
