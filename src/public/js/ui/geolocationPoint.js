
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
        let marker = document.querySelector('.ui-map-geolocation-marker > svg');
        marker.style.transform = `rotate(${angle}deg)`;
    }

    /**
     * Returns the default Leaflet marker.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @return {object} - The default Leaflet marker.
     */
    static getMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [30, 30],
                    'iconAnchor': [15, 15],
                    'className': 'ui-map-geolocation-marker',
                    'html': markerSvg
                })
            }
        );
    }

    /**
     * Returns the heading type Leaflet marker.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @return {object} - The heading type Leaflet marker.
     */
    static getHeadingMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [30, 30],
                    'iconAnchor': [15, 15],
                    'className': 'ui-map-geolocation-marker',
                    'html': headingMarkerSvg
                })
            }
        );
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
                'stroke': false,
                'fillColor': 'rgba(34, 176, 223, 0.15)',
                'fillOpacity': 1,
                'clickable': false
            });
    }
}
