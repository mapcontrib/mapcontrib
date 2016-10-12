
import L from 'leaflet';
import markerSvg from '../../img/geolocation_marker.svg';
import headingMarkerSvg from '../../img/geolocation_heading_marker.svg';


export default class GeolocationPoint {
    /**
     * Rotate the marker.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {number} angle - The marker's angle.
     */
    static rotate(angle) {
        const marker = document.querySelector('.ui-map-geolocation-marker > svg');
        marker.style.transform = `rotate(${angle}deg)`;
    }

    /**
     * Returns the default Leaflet marker.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @return {L.marker} - The default Leaflet marker.
     */
    static getDefaultMarker() {
        return L.marker(
            [0, 0],
            {
                clickable: false,
                icon: GeolocationPoint._getDefaultMarkerIcon(),
            }
        );
    }

    /**
     * Returns the heading type Leaflet marker.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @return {L.marker} - The heading type Leaflet marker.
     */
    static getHeadingMarker() {
        return L.marker(
            [0, 0],
            {
                clickable: false,
                icon: GeolocationPoint._getHeadingMarkerIcon(),
            }
        );
    }

    /**
     * Returns the default Leaflet marker icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access private
     * @return {L.divIcon} - The default Leaflet marker icon.
     */
    static _getDefaultMarkerIcon() {
        return L.divIcon({
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            className: 'ui-map-geolocation-marker',
            html: markerSvg,
        });
    }

    /**
     * Returns the heading type Leaflet marker icon.
     *
     * @author Guillaume AMAT
     * @static
     * @access private
     * @return {L.divIcon} - The heading type Leaflet marker icon.
     */
    static _getHeadingMarkerIcon() {
        return L.divIcon({
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            className: 'ui-map-geolocation-marker',
            html: headingMarkerSvg,
        });
    }

    /**
     * Sets the default icon to a marker.
     *
     * @author Guillaume AMAT
     * @static
     * @return {L.marker} - A Leaflet marker.
     * @access public
     * @return {L.marker} - The Leaflet marker.
     */
    static setDefaultIcon(marker) {
        marker.setIcon(
            GeolocationPoint._getDefaultMarkerIcon()
        );

        return marker;
    }

    /**
     * Sets the heading type icon to a marker.
     *
     * @author Guillaume AMAT
     * @static
     * @return {L.marker} - A Leaflet marker.
     * @access public
     * @return {L.marker} - The Leaflet marker.
     */
    static setHeadingIcon(marker) {
        marker.setIcon(
            GeolocationPoint._getHeadingMarkerIcon()
        );

        return marker;
    }

    /**
     * Returns the accuracy Leaflet circle.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @return {object} - The accuracy Leaflet circle.
     */
    static getAccuracyCircle() {
        return L.circle(
            [0, 0],
            0,
            {
                stroke: false,
                fillColor: 'rgba(34, 176, 223, 0.15)',
                fillOpacity: 1,
                clickable: false,
            });
    }
}
