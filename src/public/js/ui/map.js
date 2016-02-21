

define(['const'],
function (CONST) {

    'use strict';

    /**
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @returns {object} - A Leaflet divIcon.
     */
    function buildPoiLayerIcon (poiLayerModel) {

        var markerShape = poiLayerModel.get('markerShape'),
        markerIcon = poiLayerModel.get('markerIcon'),
        markerIconType = poiLayerModel.get('markerIconType'),
        markerIconUrl = poiLayerModel.get('markerIconUrl'),
        markerColor = poiLayerModel.get('markerColor'),
        iconOptions = _.extend({}, CONST.map.markers[ markerShape ]);

        iconOptions.className += ' '+ markerColor;

        switch (markerIconType) {
            case CONST.map.markerIconType.external:

                if ( markerIconUrl ) {

                    iconOptions.html += '<img src="'+ markerIconUrl +'" class="external-icon">';
                }
                break;

            default:
            case CONST.map.markerIconType.library:
                if ( markerIcon ) {

                    iconOptions.html += '<i class="fa fa-'+ markerIcon +' fa-fw"></i>';
                }
        }

        return L.divIcon( iconOptions );
    }


    /**
    * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @returns {string} - The HTML tags of the icon.
     */
    function buildPoiLayerHtmlIcon (poiLayerModel) {

        var html = '',
        markerShape = poiLayerModel.get('markerShape'),
        markerIcon = poiLayerModel.get('markerIcon'),
        markerIconType = poiLayerModel.get('markerIconType'),
        markerIconUrl = poiLayerModel.get('markerIconUrl'),
        markerColor = poiLayerModel.get('markerColor'),
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
        'buildPoiLayerIcon': buildPoiLayerIcon,
        'buildPoiLayerHtmlIcon': buildPoiLayerHtmlIcon,
    };
});
