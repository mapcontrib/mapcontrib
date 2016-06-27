
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import jquery_ui_sortable from 'jquery-ui/sortable';
import jquery_ui_touch_punch from 'jquery-ui-touch-punch';
import EditLayerListEmptyView from './editLayerListEmpty';
import EditLayerListItemView from './editLayerListItem';


export default Marionette.CollectionView.extend({
    childView: EditLayerListItemView,

    emptyView: EditLayerListEmptyView,

    className: 'list-group reorderable removeable',

    onRender: function () {
        this.$el.sortable({
            'axis': 'y',
            'items': 'a',
            'handle': '.reorder_icon',
            'update': () => {
                this.onDnD();
            }
        });
    },

    onDnD: function (event, ui) {
        var i = 0,
        sorted_id_list = this.$el.sortable('toArray');

        _.each(sorted_id_list, function (layer_id) {
            var layerModel = this.collection.filter(function (layer) {
                return layer.cid === layer_id.replace('poi-layer-', '');
            })[0];

            layerModel.set({'order': i});

            i++;

        }, this);

        this.options.theme.set('modificationTimestamp', new Date().toISOString());
        this.options.theme.save();
        this.collection.sort();
    },
});
