
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SelectPoiLayerListItemView from './selectPoiLayerListItem';


export default Marionette.CollectionView.extend({

    childView: SelectPoiLayerListItemView,

    className: 'list-group',

    initialize: function () {

        var self = this;

        this._radio = Wreqr.radio.channel('global');

        this._user = this._radio.reqres.request('model', 'user');
    },

    addChild: function(child, ChildView, index){

        if ( child.isVisible() ) {

            Marionette.CollectionView.prototype.addChild.apply(this, arguments);
        }
    },
});
