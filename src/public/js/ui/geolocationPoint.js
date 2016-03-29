
import L from 'leaflet';
import svg from '../../img/geolocation_pointer.svg';


export default class GeolocationPoint {

    static getMarker() {
        return L.marker(
            [0, 0],
            {
                'clickable': false,
                'icon': L.divIcon({
                    'iconSize': [20, 20],
                    'iconAnchor': [10, 10],
                    'className': 'ui-map-geolocation-point',
                    'html': svg
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
