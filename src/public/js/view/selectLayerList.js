
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SelectLayerListItemView from './selectLayerListItem';


export default Marionette.CollectionView.extend({
    childView: SelectLayerListItemView,

    className: 'list-group',

    addChild: function(child, ChildView, index){
        if ( child.isVisible() ) {
            Marionette.CollectionView.prototype.addChild.apply(this, arguments);
        }
    },
});
