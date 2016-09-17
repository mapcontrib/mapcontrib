
import Marionette from 'backbone.marionette';
import SelectLayerListItemView from './item';


export default Marionette.CollectionView.extend({
    childView: SelectLayerListItemView,

    className: 'list-group',

    addChild(child) {
        if ( child.isVisible() ) {
            Marionette.CollectionView.prototype.addChild.apply(this);
        }
    },
});
