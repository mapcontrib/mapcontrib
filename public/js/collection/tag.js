
import _ from 'underscore';
import Backbone from 'backbone';
import Sifter from 'sifter';
import TagModel from '../model/tag';


export default Backbone.Collection.extend({
    model: TagModel,

    comparator: 'order',

    initialize(models, options) {
        this.options = options;

        this.on('add', this.onAdd);
        this.on('update', this._prepareSifter);
    },

    onAdd(model) {
        if (typeof model.get('order') !== 'undefined') {
            return;
        }

        const max_order_model = _.max( this.models, function (model) {
            return model.get('order') || 0;
        });
        const max_order = (max_order_model.get('order') || 0);

        model.set('order', max_order + 1);
    },
});
