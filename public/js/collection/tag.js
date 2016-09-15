
import _ from 'underscore';
import Backbone from 'backbone';
import TagModel from '../model/tag';


export default Backbone.Collection.extend({
    model: TagModel,

    comparator: 'order',

    initialize(models, options) {
        this.options = options;

        this.on('add', this.onAdd);
    },

    onAdd(model) {
        if (typeof model.get('order') !== 'undefined') {
            return;
        }

        const maxOrderModel = _.max( this.models, m => m.get('order') || 0);
        const maxOrder = (maxOrderModel.get('order') || 0);

        model.set('order', maxOrder + 1);
    },
});
