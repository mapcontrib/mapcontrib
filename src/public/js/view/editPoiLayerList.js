

define([

    'underscore',
    'backbone',
    'backbone.marionette',
    '../../templates/templates',
    'jquery-ui/sortable',
    'jquery-ui-touch-punch',
    './editPoiLayerListEmpty',
    './editPoiLayerListItem',
],
function (

    _,
    Backbone,
    Marionette,
    templates,
    jquery_ui_sortable,
    jquery_ui_touch_punch,
    EditPoiLayerListEmptyView,
    EditPoiLayerListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: EditPoiLayerListItemView,

        emptyView: EditPoiLayerListEmptyView,

        className: 'list-group reorderable removeable',

        onRender: function () {

            var self = this;

            this.$el.sortable({

                'axis': 'y',
                'items': 'a',
                'handle': '.reorder_icon',
                'update': function () {

                    self.onDnD();
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
                layerModel.save();

                i++;

            }, this);

            this.collection.sort();
        },
    });
});
