
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
        document.querySelector('.leaflet-marker-pane').classList.add('in_contribution');
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
        document.querySelector('.leaflet-marker-pane').classList.remove('in_contribution');
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
            iconHtml = CONST.map.shape.html;
        }
        else {
            const markerShape = layerModel.get('markerShape');
            iconColor = layerModel.get('markerColor');
            className = CONST.map.markers[markerShape].className;
            iconHtml = MapUi.buildMarkerLayerIconOptions(layerModel).html;
        }

        return `<div class="${className} ${iconColor}">${iconHtml}</div>`;
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
        const markerShape = layerModel.get('markerShape');
        const markerIcon = layerModel.get('markerIcon');
        const markerIconType = layerModel.get('markerIconType');
        const markerIconUrl = layerModel.get('markerIconUrl');
        const markerColor = layerModel.get('markerColor');
        const iconOptions = { ...CONST.map.markers[ markerShape ] };

        iconOptions.className += ` ${markerColor}`;

        switch (markerIconType) {
            case CONST.map.markerIconType.external:
                if ( markerIconUrl ) {
                    iconOptions.html += `<img src="${markerIconUrl}" class="external-icon">`;
                }
                break;

            default:
            case CONST.map.markerIconType.library:
                if ( markerIcon ) {
                    iconOptions.html += `<i class="fa fa-${markerIcon} fa-fw"></i>`;
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
     * @param {string} layerModel - Model of the polyline's POI layer.
     * @return {object} - The polyline options.
     */
    static buildLayerPolylineStyle (layerModel) {
        return {
            ...CONST.map.wayPolylineOptions,
            ...{ color: CONST.colors[ layerModel.get('color') ] }
        };
    }


    /**
     * Returns the layer polygon options.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - Model of the polygon's POI layer.
     * @return {object} - The polygon options.
     */
    static buildLayerPolygonStyle (layerModel) {
        return {
            ...CONST.map.wayPolygonOptions,
            ...{ color: CONST.colors[ layerModel.get('color') ] }
        };
    }


    /**
     * Returns a marker cluster built for a layer model.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - The layer model.
     * @return {object} - The marker cluster layer.
     */
    static buildMarkerClusterLayer (layerModel) {
        return L.markerClusterGroup({
            'polygonOptions': CONST.map.markerCLusterPolygonOptions,
            'animate': false,
            'animateAddingMarkers': false,
            'spiderfyOnMaxZoom': false,
            'disableClusteringAtZoom': 18,
            'zoomToBoundsOnClick': true,
            'iconCreateFunction': cluster => {
                const count = cluster.getChildCount();
                const color = layerModel.get('markerColor');

                return L.divIcon({
                    html: `<div class="marker-cluster ${color}">${count}</div>`
                });
            }
        });
    }


    /**
     * Returns a heat layer built for a layer model.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} layerModel - The layer model.
     * @return {object} - The heat layer.
     */
    static buildHeatLayer (layerModel) {
        const heatLayer = L.heatLayer([], {
            minOpacity: layerModel.get('heatMinOpacity'),
            maxZoom: layerModel.get('heatMaxZoom'),
            max: layerModel.get('heatMax'),
            blur: layerModel.get('heatBlur'),
            radius: layerModel.get('heatRadius'),
        });

        heatLayer.addLayer = (layer) => {
            if (layer.feature.geometry.type === 'Point') {
                heatLayer.addLatLng(
                    L.latLng(
                        layer.feature.geometry.coordinates[1],
                        layer.feature.geometry.coordinates[0]
                    )
                );
            }
        };

        return heatLayer;
    }
}
