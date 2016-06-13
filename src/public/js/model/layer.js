
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import CONST from '../const';


export default Backbone.RelationalModel.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'layer',

    defaults: {
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
