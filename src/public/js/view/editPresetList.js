

define([

    'underscore',
    'backbone',
    'marionette',
    'bootstrap',
    'templates',
    'jquery-ui-sortable',
    'jquery-ui-touch-punch',
    'view/editPresetListEmpty',
    'view/editPresetListItem',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    jquery_ui_sortable,
    jquery_ui_touch_punch,
    EditPresetListEmptyView,
    EditPresetListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: EditPresetListItemView,

        emptyView: EditPresetListEmptyView,

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

            _.each(sorted_id_list, function (preset_id) {

                var presetModel = this.collection.filter(function (preset) {

                    return preset.cid === preset_id.replace('preset-', '');
                })[0];

                presetModel.set({'order': i});
                presetModel.save();

                i++;

            }, this);

            this.collection.sort();
        },
    });
});
