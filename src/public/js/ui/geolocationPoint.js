
import L from 'leaflet';

export default class GeolocationPoint {

    static getMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [16, 16],
                    'iconAnchor': [8, 8],
                    'className': '',
                    'html': `<div class="ui-map-geolocation-point"></div>`
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
