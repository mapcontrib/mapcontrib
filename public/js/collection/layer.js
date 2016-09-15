
import _ from 'underscore';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import LayerModel from '../model/layer';


export default Backbone.Collection.extend({
    model: LayerModel,

    comparator: 'order',

    initialize() {
        this._radio = Wreqr.radio.channel('global');

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


    /**
     * Returns an array of all the visible layers.
     *
     * @author Guillaume AMAT
     * @return An array of all the visible layers
     */
    getVisibleLayers() {
        const isOwner = this._radio.reqres.request('user:isOwner');

        if ( isOwner ) {
            return this.models;
        }

        return this.where({ visible: true });
    },
});
