
import _ from 'underscore';
import L from 'leaflet';
import GeolocationPoint from '../ui/geolocationPoint.js';


export default class Geolocation {

    constructor(map) {
        this._dragged = false;
        this._map = map;
        this._marker = GeolocationPoint.getMarker();
        this._accuracyCircle = GeolocationPoint.getAccuracyCircle();
    }

    locate() {
        this._dragged = false;

        this.stopLocate();

        this.removeEventListeners();
        this.addEventListeners();

        this.addMarker();

        this._map.locate({
            'watch': true,
            'setView': true,
            'enableHighAccuracy': true,
        });
    }

    stopLocate() {
        this.removeMarker();
        this._map.stopLocate();
    }

    addMarker() {
        this._marker.setOpacity(0);
        this._map.addLayer( this._marker );

        this._accuracyCircle.setStyle({
            'fillOpacity': 0
        });
        this._map.addLayer( this._accuracyCircle );
    }

    removeMarker() {
        this._map.removeLayer( this._marker );
        this._map.removeLayer( this._accuracyCircle );
    }

    addEventListeners() {
        this._map
        .on('locationfound', this.onLocationFound, this)
        .on('locationerror', this.onLocationError, this)
        .on('dragend', this.onDragEnd, this)
        .on('moveend', this.onMoveEnd, this);
    }

    removeEventListeners() {
        this._map
        .off('locationfound', this.onLocationFound, this)
        .off('locationerror', this.onLocationError, this)
        .off('dragend', this.onDragEnd, this)
        .off('moveend', this.onMoveEnd, this);
    }

    onLocationFound(e) {
        this._marker.setLatLng(e.latlng);
        this._marker.setOpacity(1);

        this._accuracyCircle.setLatLng(e.latlng);
        this._accuracyCircle.setRadius(e.accuracy / 2);
        this._accuracyCircle.setStyle({
            'fillOpacity': 1
        });
    }

    onLocationError() {
        this._marker.setOpacity(0.5);
    }

    onDragEnd() {
        this._dragged = true;
    }

    onMoveEnd() {
        this._map.locate({
            'watch': true,
            'setView': !this._dragged,
            'enableHighAccuracy': true,
        });
    }
}
