
import _ from 'underscore';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import CONST from '../const';
import LayerModel from '../model/layer';


export default Backbone.Collection.extend({
    model: LayerModel,

    comparator: 'order',

    initialize: function (models, options) {
        this._radio = Wreqr.radio.channel('global');

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


    /**
     * Returns an array of all the visible layers.
     *
     * @author Guillaume AMAT
     * @return An array of all the visible layers
     */
    getVisibleLayers: function () {
        const isOwner = this._radio.reqres.request('user:isOwner');

        if ( isOwner ) {
            return this.models;
        }
        else {
            return this.where({ 'visible': true });
        }
    },
});
