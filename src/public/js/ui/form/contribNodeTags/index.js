
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
                'valueReadOnly': false,
                'nonOsmData': false,
                'type': 'text',
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
                'valueReadOnly': false,
                'nonOsmData': false,
                'type': 'text',
            };
        }

        this.collection.add( tag );
    },

    getTags: function () {
        return this.collection.toJSON();
    },

    hasFileToUpload: function () {
        let hasFileToUpload = false;

        for (const i in this.children._views) {
            const fileTag = this.children._views[i];

            if ( fileTag.isFileTag() && fileTag.isNotEmpty() ) {
                hasFileToUpload = true;
            }
        }

        return hasFileToUpload;
    },
});
