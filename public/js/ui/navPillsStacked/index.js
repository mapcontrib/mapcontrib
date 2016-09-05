
import Marionette from 'backbone.marionette';
import NavPillsStackedCollection from './collection';
import NavPillsStackedListItemView from './listItem';
import listTemplate from './list.ejs';


export default Marionette.CompositeView.extend({
    template: listTemplate,

    childView: NavPillsStackedListItemView,

    childViewContainer: 'ul',

    initialize() {
        this.collection = new NavPillsStackedCollection();
    },

    setItems(items) {
        this.collection.set(items);
    },
});
