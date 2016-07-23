
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import Wreqr from 'backbone.wreqr';
import CONST from '../const';
import { uuid } from '../core/utils';


export default Backbone.RelationalModel.extend({
    defaults: {
        'creationDate': new Date().toISOString(),
        'modificationDate': new Date().toISOString(),
        'uniqid': undefined,
        'type': CONST.layerType.overpass,
        'name': undefined,
        'description': undefined,
        'visible': true,
        'dataEditable': true,
        'minZoom': 14,
        'popupContent': undefined,
        'order': undefined,

        // Point based layer specific
        'markerShape': 'marker1',
        'markerColor': 'orange',
        'markerIconType': CONST.map.markerIconType.library,
        'markerIcon': undefined,
        'markerIconUrl': undefined,

        // Shape files based layer specific
        'color': 'turquoise',
        'fileUri': undefined,

        // Overpass type specific
        'overpassRequest': undefined,
        'cache': false,
        'cacheUpdateSuccess': undefined,
        'cacheUpdateSuccessDate': undefined,
        'cacheUpdateDate': undefined,
        'cacheUpdateError': undefined,
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        if (!this.get('uniqid')) {
            this.set('uniqid', uuid());
        }
    },

    updateModificationDate: function () {
        this.set('modificationDate', new Date().toISOString());
    },

    /**
     * Tells if the layer is visible.
     *
     * @author Guillaume AMAT
     * @return boolean
     */
     isVisible: function () {
         const isOwner = this._radio.reqres.request('user:isOwner');

         if ( isOwner ) {
             return true;
         }
         else {
             return this.get('visible');
         }
     }
});
