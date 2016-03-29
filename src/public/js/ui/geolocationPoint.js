
import L from 'leaflet';
import markerSvg from '../../img/geolocation_marker.svg';
import headingMarkerSvg from '../../img/geolocation_heading_marker.svg';


export default class GeolocationPoint {

    static rotate(angle) {
        let marker = document.querySelector('.ui-map-geolocation-marker > svg');
        marker.style.transform = `rotate(${angle}deg)`;
    }

    static getMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [20, 20],
                    'iconAnchor': [10, 10],
                    'className': 'ui-map-geolocation-marker',
                    'html': markerSvg
                })
            }
        );
    }

    static getHeadingMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [20, 20],
                    'iconAnchor': [10, 10],
                    'className': 'ui-map-geolocation-marker',
                    'html': headingMarkerSvg
                })
            }
        );
    }

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
