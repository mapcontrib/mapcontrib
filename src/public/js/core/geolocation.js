
import L from 'leaflet';
import GeolocationPoint from '../ui/geolocationPoint';


export default class Geolocation {

    /**
     * @access public
     * @param {object} map - A Leaflet map.
     */
    constructor(map) {
        this._dragged = false;
        this._locateInProgress = false;
        this._map = map;
    }

    /**
     * Starts the location watch.
     * @access public
     */
    locate() {
        if (this._locateInProgress === true) {
            this.stopLocate();
        }

        this._dragged = false;
        this._locateInProgress = true;

        this._addEventListeners();

        this._map.locate({
            'watch': true,
            'setView': false,
            'enableHighAccuracy': true,
        });
    }

    /**
     * Stops the location watch.
     * @access public
     */
    stopLocate() {
        this._locateInProgress = false;

        this._map.stopLocate();
        this._removeEventListeners();
        this._removeMarker();
    }

    /**
     * Adds the geolocation marker to the map.
     * @access private
     */
    _addMarker(marker) {
        this._marker = marker;
        this._marker.setOpacity(0);

        this._accuracyCircle = GeolocationPoint.getAccuracyCircle();
        this._accuracyCircle.setStyle({
            'fillOpacity': 0
        });

        this._map.addLayer( this._marker );
        this._map.addLayer( this._accuracyCircle );
    }

    /**
     * Removes the geolocation marker from the map.
     * @access private
     */
    _removeMarker() {
        if (this._marker) {
            this._map.removeLayer( this._marker );
            this._map.removeLayer( this._accuracyCircle );

            this._marker = null;
        }
    }

    /**
     * Adds the needed event listeners.
     * @access private
     */
    _addEventListeners() {
        window.addEventListener('deviceorientation', this._onOrientationFound);

        this._map
        .on('locationfound', this._onLocationFound, this)
        .on('locationerror', this._onLocationError, this)
        .on('dragend', this._onDragEnd, this)
        .on('moveend', this._onMoveEnd, this);
    }

    /**
     * Removes the event listeners.
     * @access private
     */
    _removeEventListeners() {
        window.removeEventListener('deviceorientation', this._onOrientationFound);

        this._map
        .off('locationfound', this._onLocationFound, this)
        .off('locationerror', this._onLocationError, this)
        .off('dragend', this._onDragEnd, this)
        .off('moveend', this._onMoveEnd, this);
    }

    /**
     * The locationfound event handler.
     * @access private
     */
    _onLocationFound(e) {
        if (!this._marker) {
            if (DeviceOrientationEvent) {
                this._addMarker(GeolocationPoint.getHeadingMarker());
            }
            else {
                this._addMarker(GeolocationPoint.getMarker());
            }
        }

        if (e.heading) {
            GeolocationPoint.rotate(e.heading);
        }

        this._marker.setLatLng(e.latlng);
        this._marker.setOpacity(1);

        this._accuracyCircle.setLatLng(e.latlng);
        this._accuracyCircle.setRadius(e.accuracy / 2);
        this._accuracyCircle.setStyle({
            'fillOpacity': 1
        });

        if (this._dragged === false) {
            let zoom = this._map.getBoundsZoom(e.bounds);
            this._map.setView(e.latlng, zoom, { 'animate': true});
        }
    }

    /**
     * The locationerror event handler.
     * @access private
     */
    _onLocationError() {
        this._marker.setOpacity(0.5);
    }

    /**
     * The orientationfound event handler.
     * @access private
     * @static
     */
    static _onOrientationFound(e) {
        GeolocationPoint.rotate(e.alpha * -1);
    }

    /**
     * The dragend event handler.
     * @access private
     */
    _onDragEnd() {
        this._dragged = true;
    }

    /**
     * The moveend event handler.
     * @access private
     */
    _onMoveEnd() {
        this._map.locate({
            'watch': true,
            'setView': false,
            'enableHighAccuracy': true,
        });
    }
}
