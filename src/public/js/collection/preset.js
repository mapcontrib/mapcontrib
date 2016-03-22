
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');
var PresetModel = require('../model/preset');


module.exports = Backbone.Collection.extend({

    url: function () {

        return settings.apiPath + 'theme/'+ this.options.themeId +'/presets';
    },

    model: PresetModel,

    comparator: 'order',

    initialize: function (models, options) {

        this.options = options;

        this.on('add', this.onAdd);
    },

    onAdd: function (model) {

        if (model.get('_id')) {

            return;
        }

        var max_order_model = _.max( this.models, function (model) {

            return model.get('order') || 0;
        }),
        max_order = (max_order_model.get('order') || 0);

        model.set('order', max_order + 1);
    },
});
