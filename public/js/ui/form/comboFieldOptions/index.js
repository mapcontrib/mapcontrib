
import Marionette from 'backbone.marionette';
import Collection from './collection';
import ListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ListItemView,

    childViewOptions() {
        return {
            comboType: this.options.comboType,
            keyPrefix: this.options.keyPrefix,
        };
    },

    initialize(options) {
        this.collection = new Collection();

        if (options.options && options.options.length > 0) {
            for (const value of options.options) {
                this.collection.add({ value });
            }
        }
        else {
            this.collection.add({});
        }
    },

    addOption(option) {
        if ( option === false ) {
            return false;
        }

        if ( typeof option === 'undefined' ) {
            return this.collection.add({});
        }

        if (option.value) {
            const currentTag = this.collection.findWhere({ value: option.value });

            if (currentTag) {
                return currentTag.set(option);
            }
        }

        return this.collection.add(option);
    },

    getOptions() {
        return this.collection.map(model => model.get('value'));
    },
});
