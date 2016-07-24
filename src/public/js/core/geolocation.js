
import L from 'leaflet';
import GeolocationPoint from '../ui/geolocationPoint';


export default class Geolocation {
    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} map - A Leaflet map.
     */
    constructor(map) {
        this._isDragged = false;
        this._isLocateInProgress = false;
        this._hasHeadingMarker = false;
        this._lastAutomaticZoom = null;
        this._map = map;
    }

    /**
     * Starts the location watch.
     *
     * @author Guillaume AMAT
     * @access public
     */
    locate() {
        if (this._isLocateInProgress === true) {
            this.stopLocate();
        }

        this._isDragged = false;
        this._isLocateInProgress = true;
        this._lastAutomaticZoom = null;

        this._addEventListeners();

        this._map.locate({
            'watch': true,
            'setView': false,
            'enableHighAccuracy': true,
        });
    }

    /**
     * Stops the location watch.
     *
     * @author Guillaume AMAT
     * @access public
     */
    stopLocate() {
        this._isLocateInProgress = false;

        this._map.stopLocate();
        this._removeEventListeners();
        this._removeMarker();
    }

    /**
     * Adds the geolocation marker to the map.
     *
     * @author Guillaume AMAT
     * @access private
     * @param {object} marker - A Leaflet marker.
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
     *
     * @author Guillaume AMAT
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
     *
     * @author Guillaume AMAT
     * @access private
     */
    _addEventListeners() {
        window.addEventListener('deviceorientation', this._onOrientationFound);

        this._map
        .on('locationfound', this._onLocationFound, this)
        .on('locationerror', this._onLocationError, this)
        .on('dragstart', this._onDragStart, this)
        .on('moveend', this._onMoveEnd, this);
    }

    /**
     * Removes the event listeners.
     *
     * @author Guillaume AMAT
     * @access private
     */
    _removeEventListeners() {
        window.removeEventListener('deviceorientation', this._onOrientationFound);

        this._map
        .off('locationfound', this._onLocationFound, this)
        .off('locationerror', this._onLocationError, this)
        .off('dragstart', this._onDragStart, this)
        .off('moveend', this._onMoveEnd, this);
    }

    /**
     * The locationfound event handler.
     *
     * @author Guillaume AMAT
     * @access private
     */
    _onLocationFound(e) {
        if (!this._marker) {
            this._addMarker(
                GeolocationPoint.getDefaultMarker()
            );
        }

        if (e.heading) {
            this._rotateMarker(e.heading);
        }

        this._marker.setLatLng(e.latlng);
        this._marker.setOpacity(1);

        this._accuracyCircle.setLatLng(e.latlng);
        this._accuracyCircle.setRadius(e.accuracy / 2);
        this._accuracyCircle.setStyle({
            'fillOpacity': 1
        });

        if (this._isDragged === false) {
            let zoom = this._map.getZoom();

            if (!this._lastAutomaticZoom || this._lastAutomaticZoom === zoom) {
                zoom = this._map.getBoundsZoom(e.bounds);
                this._lastAutomaticZoom = zoom;
            }

            this._map.setView(
                e.latlng,
                zoom,
                { 'animate': false}
            );
        }
    }

    /**
     * The locationerror event handler.
     *
     * @author Guillaume AMAT
     * @access private
     */
    _onLocationError(a, b, c) {
        console.log(a, b, c);
        if (this._marker) {
            this._marker.setOpacity(0.5);
        }
    }

    /**
     * The orientationfound event handler.
     *
     * @author Guillaume AMAT
     * @access private
     * @param {object} e - Event object.
     */
    _onOrientationFound(e) {
        this._rotateMarker(e.alpha * -1);
    }

    /**
     * The dragstart event handler.
     *
     * @author Guillaume AMAT
     * @access private
     */
    _onDragStart() {
        this._isDragged = true;
    }

    /**
     * The moveend event handler.
     *
     * @author Guillaume AMAT
     * @access private
     */
    _onMoveEnd() {
        this._map.locate({
            'watch': true,
            'setView': false,
            'enableHighAccuracy': true,
        });
    }

    /**
     * The moveend event handler.
     *
     * @author Guillaume AMAT
     * @access private
     * @param {number} angle - The orientation angle.
     */
    _rotateMarker(angle) {
        if (!this._hasHeadingMarker) {
            this._hasHeadingMarker = true;
            GeolocationPoint.setHeadingIcon(this._marker);
        }

        GeolocationPoint.rotate(angle);
    }
}
