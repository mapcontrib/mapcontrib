
import Marionette from 'backbone.marionette';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ContribNodeTagsListItemView,

    childViewOptions() {
        return {
            iDPresetsHelper: this.options.iDPresetsHelper,
        };
    },

    initialize(options) {
        this.collection = new ContribNodeTagsCollection(options.tags || [{}]);
    },

    addTag(tag) {
        if ( !tag ) {
            return this.collection.add({});
        }

        if (tag.key) {
            const currentTag = this.collection.findWhere({ key: tag.key });

            if (currentTag) {
                return currentTag.set(tag);
            }
        }

        this.collection.add(tag);

        return true;
    },

    getTags() {
        return this.collection.toJSON();
    },
});
