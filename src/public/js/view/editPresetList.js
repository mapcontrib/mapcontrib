
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var jquery_ui_sortable = require('jquery-ui/sortable');
var jquery_ui_touch_punch = require('jquery-ui-touch-punch');
var EditPresetListEmptyView = require('./editPresetListEmpty');
var EditPresetListItemView = require('./editPresetListItem');


module.exports = Marionette.CollectionView.extend({

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
