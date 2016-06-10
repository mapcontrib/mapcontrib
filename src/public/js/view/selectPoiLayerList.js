
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SelectPoiLayerListItemView from './selectPoiLayerListItem';


export default Marionette.CollectionView.extend({
    childView: SelectPoiLayerListItemView,

    className: 'list-group',

    addChild: function(child, ChildView, index){
        if ( child.isVisible() ) {
            Marionette.CollectionView.prototype.addChild.apply(this, arguments);
        }
    },
});
