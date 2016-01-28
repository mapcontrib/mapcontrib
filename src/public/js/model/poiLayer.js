

define([

    'underscore',
    'backbone',
    'settings',
],
function (

    _,
    Backbone,
    settings
) {

    'use strict';

    return Backbone.Model.extend({

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
            'markerIcon': undefined,
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
});
