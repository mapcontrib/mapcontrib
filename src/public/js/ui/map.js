

define(['const'],
function (CONST) {

    'use strict';

    /**
     * @param {string} markerShape - Global shape of the marker.
     * @param {string} markerIcon - Icon to insert in the marker.
     * @param {string} markerColor - Color of the marker.
     * @returns {object} - A Leaflet divIcon.
     */
    function getPoiLayerIcon (markerShape, markerIcon, markerColor) {

        var iconOptions = _.extend({}, CONST.map.markers[ markerShape ]);

        iconOptions.className += ' '+ markerColor;

        if ( markerIcon ) {

            iconOptions.html += '<i class="fa fa-'+ markerIcon +' fa-fw"></i>';
        }

        return L.divIcon( iconOptions );
    }


    /**
     * @param {string} markerShape - Global shape of the marker.
     * @param {string} markerIcon - Icon to insert in the marker.
     * @param {string} markerColor - Color of the marker.
     * @returns {string} - The HTML tags of the icon.
     */
    function getPoiLayerHtmlIcon (markerShape, markerIcon, markerColor) {

        var html = '',
        iconOptions = _.extend({}, CONST.map.markers[ markerShape ]);

        html += '<div class="marker marker-1 '+ markerColor +'">';
        html += iconOptions.html;

        if ( markerIcon ) {

            html += '<i class="fa fa-'+ markerIcon +' fa-fw"></i>';
        }

        html += '</div>';

        return html;
    }



    return {
        'getPoiLayerIcon': getPoiLayerIcon,
        'getPoiLayerHtmlIcon': getPoiLayerHtmlIcon,
    };
});
