
import _ from 'underscore';
import Backbone from 'backbone';
import Sifter from 'sifter';
import PresetModel from '../model/preset';


export default Backbone.Collection.extend({
    model: PresetModel,

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

        const maxOrderModel = _.max( this.models, m => m.get('order') || 0);
        const maxOrder = (maxOrderModel.get('order') || 0);

        model.set('order', maxOrder + 1);
    },

    _prepareSifter() {
        this._sifterPresets = this.models.map(preset => ({
            preset,
            name: preset.get('name'),
            description: preset.get('description'),
        }));

        this._sifter = new Sifter( this._sifterPresets );
    },

    buildPresetsFromSearchString(searchString) {
        const results = this._sifter.search(searchString, {
            fields: [ 'name', 'description' ],
            sort: [{ field: 'name', direction: 'asc' }],
            limit: 20,
        });

        return results.items.map(result => this._sifterPresets[result.id].preset);
    },
});
