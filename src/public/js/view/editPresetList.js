
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import jquery_ui_sortable from 'jquery-ui/sortable';
import jquery_ui_touch_punch from 'jquery-ui-touch-punch';
import EditPresetListEmptyView from './editPresetListEmpty';
import EditPresetListItemView from './editPresetListItem';


export default Marionette.CollectionView.extend({
    childView: EditPresetListItemView,

    emptyView: EditPresetListEmptyView,

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

        _.each(sorted_id_list, function (preset_id) {
            var presetModel = this.collection.filter(function (preset) {
                return preset.cid === preset_id.replace('preset-', '');
            })[0];

            presetModel.set({'order': i});

            i++;

        }, this);

        this.options.theme.updateModificationDate();
        this.options.theme.save();
        this.collection.sort();
    },
});
