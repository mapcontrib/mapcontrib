
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');
var CONST = require('../const');


module.exports = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: settings.apiPath + 'poiLayer',

    defaults: {

        'themeId': undefined,
        'name': undefined,
        'description': undefined,
        'visible': true,
        'dataEditable': true,
        'overpassRequest': undefined,
        'minZoom': 14,
        'popupContent': undefined,
        'order': undefined,
        'markerShape': 'marker1',
        'markerColor': 'orange',
        'markerIconType': CONST.map.markerIconType.library,
        'markerIcon': undefined,
        'markerIconUrl': undefined,
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
