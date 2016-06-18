
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import CONST from '../const';


export default Backbone.RelationalModel.extend({
    defaults: {
        'uniqid': undefined,
        'type': CONST.layerType.overpass,
        'name': undefined,
        'description': undefined,
        'visible': true,
        'dataEditable': true,
        'minZoom': 14,
        'popupContent': undefined,
        'order': undefined,
        'markerShape': 'marker1',
        'markerColor': 'orange',
        'markerIconType': CONST.map.markerIconType.library,
        'markerIcon': undefined,
        'markerIconUrl': undefined,

        // Overpass type specific
        'overpassRequest': undefined,
    },

    initialize: function () {
        if (!this.get('uniqid')) {
            let uniqid = this.cid +'_'+ new Date().getTime();
            this.set('uniqid', uniqid);
        }
    },

    /**
     * Tells if the layer is visible.
     *
     * @author Guillaume AMAT
     * @return boolean
     */
     isVisible: function () {
        return this.get('visible');
     }
});
