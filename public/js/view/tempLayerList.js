
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import jquery_ui_sortable from 'jquery-ui/sortable';
import jquery_ui_touch_punch from 'jquery-ui-touch-punch';
import TempLayerListEmptyView from './tempLayerListEmpty';
import TempLayerListItemView from './tempLayerListItem';


export default Marionette.CollectionView.extend({
    childView: TempLayerListItemView,

    emptyView: TempLayerListEmptyView,

    className: 'list-group reorderable removeable',

    onRender() {
        this.$el.sortable({
            'axis': 'y',
            'items': 'a',
            'handle': '.reorder_icon',
            update: () => {
                this.onDnD();
            }
        });
    },

    onDnD(event, ui) {
        var i = 0,
        sorted_id_list = this.$el.sortable('toArray');

        _.each(sorted_id_list, function (layer_id) {
            var layerModel = this.collection.filter(function (layer) {
                return layer.cid === layer_id.replace('temp-layer-', '');
            })[0];

            layerModel.set({'order': i});

            i++;

        }, this);

        this.collection.sort();
    },
});
