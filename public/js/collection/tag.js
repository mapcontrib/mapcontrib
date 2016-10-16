
import _ from 'underscore';
import Backbone from 'backbone';
import TagModel from '../model/tag';
import Locale from 'core/locale';


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

    getLocalizedTypeaheadFieldLabel(key) {
        const tag = this.findWhere({ key });

        if (tag) {
            return Locale.getLocalized(tag, 'key');
        }

        return undefined;
    },

    getFieldsForTypeahead() {
        const fields = [];

        for (const tag of this.models) {
            fields.push({
                key: tag.get('key'),
                type: tag.get('type'),
                label: Locale.getLocalized(tag, 'key'),
            });
        }

        return fields;
    },
});
