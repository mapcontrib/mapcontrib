
import Marionette from 'backbone.marionette';
import PresetNodeTagsCollection from './collection';
import PresetNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: PresetNodeTagsListItemView,

    initialize(options) {
        this.collection = new PresetNodeTagsCollection(options.items || []);
    },

    setTags(tags) {
        this.collection.set(tags);
    },

    addTag() {
        this.collection.add({});
    },

    getTags() {
        return this.collection.toJSON();
    },
});
