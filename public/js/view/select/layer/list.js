
import Marionette from 'backbone.marionette';
import SelectLayerListItem from './item';


export default Marionette.CollectionView.extend({
    childView: SelectLayerListItem,

    className: 'list-group',

    addChild(child, ChildView, index) {
        if ( child.isVisible() ) {
            Marionette.CollectionView.prototype.addChild.call(this, child, ChildView, index);
        }
    },
});
