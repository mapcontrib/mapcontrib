
import Marionette from 'backbone.marionette';
import PresetNodeTagsCollection from './collection';
import PresetNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: PresetNodeTagsListItemView,

    setTags(tags) {
        this.collection = new PresetNodeTagsCollection( tags );

        if (tags.length === 0) {
            this.collection.add({});
        }

        this.render();
    },

    addTag() {
        this.collection.add({});
    },

    getTags() {
        return this.collection.toJSON();
    },
});
