
import _ from 'underscore';
import CONST from '../const';


export default class MapUi {
    /**
     * Displays the contribution cross.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     */
    static showContributionCross () {
        document.body.classList.add('contribution_cross_visible');
        document.querySelector('.leaflet-marker-pane').style.display = 'none';
    }

    /**
     * Hides the contribution cross.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     */
    static hideContributionCross () {
        document.body.classList.remove('contribution_cross_visible');
        document.querySelector('.leaflet-marker-pane').style.display = 'block';
    }

    /**
     * Returns the POI layer Leaflet icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - Model of the POI layer which we request its icon.
     * @return {object} - A Leaflet divIcon.
     */
    static buildLayerIcon (L, layerModel) {
        return L.divIcon( MapUi.buildMarkerLayerIconOptions(layerModel) );
    }


    /**
     * Returns the POI layer HTML icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - Model of the POI layer which we request its icon.
     * @return {string} - The HTML tags of the icon.
     */
    static buildLayerHtmlIcon (layerModel) {
        let iconColor, className, iconHtml;

        if (layerModel.get('type') === CONST.layerType.gpx) {
            iconColor = layerModel.get('color');
            className = 'shape';
            iconHtml = '<img src="/img/shape.svg" alt="">';
        }
        else {
            let markerShape = layerModel.get('markerShape');
            iconColor = layerModel.get('markerColor');
            className = CONST.map.markers[markerShape].className;
            iconHtml = MapUi.buildMarkerLayerIconOptions(layerModel).html;
        }

        let html = `<div class="${className} ${iconColor}">`;
        html += iconHtml;
        html += `</div>`;

        return html;
    }


    /**
     * Returns the POI layer icon options.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - Model of the POI layer which we request its icon.
     * @return {object} - The icon options.
     */
    static buildMarkerLayerIconOptions (layerModel) {
        let markerShape = layerModel.get('markerShape'),
        markerIcon = layerModel.get('markerIcon'),
        markerIconType = layerModel.get('markerIconType'),
        markerIconUrl = layerModel.get('markerIconUrl'),
        markerColor = layerModel.get('markerColor'),
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


    /**
     * Returns the layer polyline options.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - Model of the POI layer which we request its icon.
     * @return {object} - The polyline options.
     */
    static buildLayerPolylineStyle (layerModel) {
        let style = _.extend(
            CONST.map.wayPolylineOptions,
            { 'color': CONST.colors[ layerModel.get('color') ] }
        );

        return style;
    }
}
