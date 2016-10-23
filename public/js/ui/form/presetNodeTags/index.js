
import Marionette from 'backbone.marionette';
import PresetNodeTagsCollection from './collection';
import PresetNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: PresetNodeTagsListItemView,

    childViewOptions() {
        return {
            iDPresetsHelper: this.options.iDPresetsHelper,
            customTags: this.options.customTags,
        };
    },

    initialize(options) {
        if (!options.tags || options.tags.length === 0) {
            this.collection = new PresetNodeTagsCollection([{}]);
        }
        else {
            this.collection = new PresetNodeTagsCollection(options.tags);
        }

        this.listenTo(this.collection, 'update', this._onCollectionUpdate);
    },

    addTag(tag) {
        if ( tag === false ) {
            return false;
        }

        if ( typeof tag === 'undefined' ) {
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

    _onCollectionUpdate() {
        const osmTags = this.collection.where({
            nonOsmData: false,
        });

        if (osmTags.length === 0) {
            this.collection.add({});
        }
    },
});
