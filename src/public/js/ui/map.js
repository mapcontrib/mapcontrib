
import _ from 'underscore';
import L from 'leaflet';
import CONST from '../const';


export default class MapUi {

    /**
     * @static
     * @access public
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @returns {object} - A Leaflet divIcon.
     */
    static buildPoiLayerIcon (poiLayerModel) {

        return L.divIcon( MapUi._buildPoiLayerHtmlIcon(poiLayerModel) );
    }


    /**
     * @static
     * @access public
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @returns {string} - The HTML tags of the icon.
     */
    static buildPoiLayerHtmlIcon (poiLayerModel) {

        let markerColor = poiLayerModel.get('markerColor');
        let iconOptions = MapUi._buildPoiLayerHtmlIcon(poiLayerModel);

        return `<div class="marker marker-1 ${markerColor}">
            ${iconOptions.html}
        </div>`;
    }


    /**
     * @static
     * @access private
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @returns {object} - The icon options.
     */
    static _buildPoiLayerHtmlIcon (poiLayerModel) {

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

        return iconOptions;
    }
}
