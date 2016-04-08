
import _ from 'underscore';
import CONST from '../const';


export default class MapUi {

    /**
     * Returns the POI layer Leaflet icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @return {object} - A Leaflet divIcon.
     */
    static buildPoiLayerIcon (L, poiLayerModel) {

        return L.divIcon( MapUi._buildPoiLayerIconOptions(poiLayerModel) );
    }


    /**
     * Returns the POI layer HTML icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @return {string} - The HTML tags of the icon.
     */
    static buildPoiLayerHtmlIcon (poiLayerModel) {

        let markerColor = poiLayerModel.get('markerColor');
        let markerShape = poiLayerModel.get('markerShape');
        let className = CONST.map.markers[markerShape].className;
        let iconOptions = MapUi._buildPoiLayerIconOptions(poiLayerModel);

        let html = `<div class="${className} ${markerColor}">`;
        html += `${iconOptions.html}`;
        html += `</div>`;

        return html;
    }


    /**
     * Returns the POI layer icon options.
     *
     * @author Guillaume AMAT
     * @static
     * @access private
     * @param {string} poiLayerModel - Model of the POI layer which we request its icon.
     * @return {object} - The icon options.
     */
    static _buildPoiLayerIconOptions (poiLayerModel) {

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
