
import _ from 'underscore';
import Backbone from 'backbone';
import CONST from '../const';
import PresetModel from '../model/preset';


export default Backbone.Collection.extend({
    model: PresetModel,

    comparator: 'order',

    initialize: function (models, options) {
        this.options = options;

        this.on('add', this.onAdd);
    },

    onAdd: function (model) {
        if (typeof model.get('order') !== 'undefined') {
            return;
        }

        let max_order_model = _.max( this.models, function (model) {
            return model.get('order') || 0;
        }),
        max_order = (max_order_model.get('order') || 0);

        model.set('order', max_order + 1);
    },
});
