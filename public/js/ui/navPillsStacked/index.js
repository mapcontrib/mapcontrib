
import Marionette from 'backbone.marionette';
import NavPillsStackedCollection from './collection';
import NavPillsStackedListItemView from './listItem';
import listTemplate from './list.ejs';
import './style.less';


export default Marionette.CompositeView.extend({
    template: listTemplate,

    childView: NavPillsStackedListItemView,

    childViewContainer: 'ul',

    initialize(options) {
        this.collection = new NavPillsStackedCollection(options.items || []);
    },

    setItems(items) {
        this.collection.set(items);
    },
});
