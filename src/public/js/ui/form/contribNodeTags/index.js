
import Marionette from 'backbone.marionette';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({

    childView: ContribNodeTagsListItemView,

    setTags: function (tags) {

        this.collection = new ContribNodeTagsCollection( tags );

        if (tags.length === 0) {

            this.collection.add({
                'keyReadOnly': false,
                'valueReadOnly': false
            });
        }

        this.render();
    },

    addTag: function () {

        this.collection.add({
            'keyReadOnly': false,
            'valueReadOnly': false
        });
    },

    getTags: function () {

        return this.collection.toJSON();
    },
});
