
import _ from 'underscore';


export default class MapData {
    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} MapData - Instance of osm-auth.
     */
    constructor () {
        this._markers = {};
        this._polygons = {};
        this._polylines = {};
        this._markerClusters = {};
        this._osmElements = {};
        this._rootLayers = {};
        this._overPassLayers = {};
    }

    /**
     * @author Guillaume AMAT
     * @access private
     * @param {object} object
     * @param {object} collection
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the object is related to.
     */
    _addObjectToListCollection (object, collection, osmElement, layerId) {
        if (!collection[layerId]) {
            collection[layerId] = {};
        }

        if (!collection[layerId][osmElement.type]) {
            collection[layerId][osmElement.type] = {};
        }

        if (!collection[layerId][osmElement.type][osmElement.id]) {
            collection[layerId][osmElement.type][osmElement.id] = [];
        }

        collection[layerId][osmElement.type][osmElement.id].push(object);
    }

    /**
     * @author Guillaume AMAT
     * @access private
     * @param {object} object
     * @param {object} collection
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the object is related to.
     */
    _setObjectToCollection (object, collection, osmElement, layerId) {
        if (!collection[layerId]) {
            collection[layerId] = {};
        }

        if (!collection[layerId][osmElement.type]) {
            collection[layerId][osmElement.type] = {};
        }

        collection[layerId][osmElement.type][osmElement.id] = object;
    }

    /**
     * @author Guillaume AMAT
     * @access private
     * @param {object} collection
     */
    _joinCollectionTypes (collection) {
        let results = [];

        for (let type in collection) {
            for (let id in collection[type]) {
                for (let object of collection[type][id]) {
                    results.push(object);
                }
            }
        }

        return results;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.Marker} marker - A Leaflet marker.
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the marker is related to.
     */
    addMarker (marker, osmElement, layerId) {
        this._addObjectToListCollection(
            marker,
            this._markers,
            osmElement,
            layerId
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.Polygon} polygon - A Leaflet polygon.
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polygon is related to.
     */
    addPolygon (polygon, osmElement, layerId) {
        this._addObjectToListCollection(
            polygon,
            this._polygons,
            osmElement,
            layerId
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.Polyline} polyline - A Leaflet polyline.
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polyline is related to.
     */
    addPolyline (polyline, osmElement, layerId) {
        this._addObjectToListCollection(
            polyline,
            this._polylines,
            osmElement,
            layerId
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} e - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the OSM element is related to.
     */
    setOsmElement (e, layerId) {
        this._setObjectToCollection(
            e,
            this._osmElements,
            e,
            layerId
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.markerCluster} markerCluster - A Leaflet markerCluster.
     * @param {number} layerId - Id of the layer the markerCluster is related to.
     */
    setMarkerCluster (markerCluster, layerId) {
        this._markerClusters[layerId] = markerCluster;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.layerGroup} rootLayer - A Leaflet layerGroup.
     * @param {number} layerId - Id of the layer the layerGroup is related to.
     */
    setRootLayer (rootLayer, layerId) {
        this._rootLayers[layerId] = rootLayer;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {L.overPassLayer} overPassLayer - A Leaflet overPassLayer.
     * @param {number} layerId - Id of the layer the overPassLayer is related to.
     */
    setOverpassLayer (overPassLayer, layerId) {
        this._overPassLayers[layerId] = overPassLayer;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} e - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the OSM element is related to.
     */
    hasOsmElement (e, layerId) {
        if (!this._osmElements[layerId]) {
            return false;
        }

        if (!this._osmElements[layerId][e.type]) {
            return false;
        }

        if (!this._osmElements[layerId][e.type][e.id]) {
            return false;
        }

        return true;
    }

    /**
     * @author Guillaume AMAT
     * @access private
     * @param {object} collection
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the objects are related to.
     */
    _getFromCollection (collection, osmElement, layerId) {
        if (!collection[layerId]) {
            return undefined;
        }

        if (!collection[layerId][osmElement.type]) {
            return undefined;
        }

        if (!collection[layerId][osmElement.type][osmElement.id]) {
            return undefined;
        }

        return collection[layerId][osmElement.type][osmElement.id];
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the markers are related to.
     */
    getMarkersFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._markers[layerId]
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the markers are related to.
     */
    getMarkersFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._markers, osmElement, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the polygons are related to.
     */
    getPolygonsFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._polygons[layerId]
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polygons are related to.
     */
    getPolygonsFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._polygons, osmElement, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the polylines are related to.
     */
    getPolylinesFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._polylines[layerId]
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polylines are related to.
     */
    getPolylinesFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._polylines, osmElement, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the objects are related to.
     */
    getObjectsFromLayer (layerId) {
        return _.union(
            this._joinCollectionTypes(
                this._markers[layerId]
            ),
            this._joinCollectionTypes(
                this._polygons[layerId]
            ),
            this._joinCollectionTypes(
                this._polylines[layerId]
            )
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the objects are related to.
     */
    getObjectsFromOsmElement (osmElement, layerId) {
        return _.union(
            this._getFromCollection(this._markers, osmElement, layerId),
            this._getFromCollection(this._polygons, osmElement, layerId),
            this._getFromCollection(this._polylines, osmElement, layerId)
        );
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the markerCluster is related to.
     */
    getMarkerCluster (layerId) {
        return this._markerClusters[layerId];
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the OSM elements are related to.
     */
    getOsmElements (layerId) {
        return this._osmElements[layerId];
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} elementId - Id of the OSM element.
     * @param {string} elementType - Type of the OSM element.
     * @param {number} layerId - Id of the layer the OSM element is related to.
     */
    getOsmElement (elementId, elementType, layerId) {
        if (this._osmElements[layerId]) {
            if (this._osmElements[layerId][ elementType ]) {
                return this._osmElements[layerId][elementType][elementId];
            }
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the root layer is related to.
     */
    getRootLayer (layerId) {
        return this._rootLayers[layerId];
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the OverPass layer is related to.
     */
    getOverpassLayer (layerId) {
        return this._overPassLayers[layerId];
    }

    /**
     * @author Guillaume AMAT
     * @access private
     * @param {object} e - JSON representation of an OSM element.
     * @param {object} collection
     * @param {number} layerId - Id of the layer the objects have to be removed.
     */
    _removeFromCollection (e, collection, layerId) {
        if (collection[layerId]) {
            if (collection[layerId][e.type]) {
                if (collection[layerId][e.type][e.id]) {
                    delete collection[layerId][e.type][e.id];
                }
            }
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the markers are related to.
     */
    removeMarkersFromLayer (layerId) {
        if (this._markers[layerId]) {
            delete this._markers[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} e - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the markers are related to.
     */
    removeMarkersFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._markers, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the polygons are related to.
     */
    removePolygonsFromLayer (layerId) {
        if (this._polygons[layerId]) {
            delete this._polygons[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polygons are related to.
     */
    removePolygonsFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._polygons, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the polylines are related to.
     */
    removePolylinesFromLayer (layerId) {
        if (this._polylines[layerId]) {
            delete this._polylines[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} e - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the polylines are related to.
     */
    removePolylinesFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._polylines, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the markerCluster is related to.
     */
    removeMarkerCluster (layerId) {
        if (this._markerClusters[layerId]) {
            delete this._markerClusters[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer the OSM elements are related to.
     */
    removeOsmElementsFromLayer (layerId) {
        if (this._osmElements[layerId]) {
            delete this._osmElements[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} e - JSON representation of an OSM element.
     * @param {number} layerId - Id of the layer the OSM element is related to.
     */
    removeOsmElement (e, layerId) {
        this._removeFromCollection(e, this._osmElements, layerId);
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} L.layerGroup - A Leaflet layerGroup.
     * @param {number} layerId - Id of the layer the object is related to.
     */
    removeRootLayer (rootLayer, layerId) {
        if (this._rootLayers[layerId]) {
            delete this._rootLayers[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} overpassLayer - A Leaflet OverpassLayer.
     * @param {number} layerId - Id of the layer the object is related to.
     */
    removeOverpassLayer (overPassLayer, layerId) {
        if (this._overPassLayers[layerId]) {
            delete this._overPassLayers[layerId];
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} layerId - Id of the layer to be cleaned.
     */
    removeLayerId (layerId) {
        this.removeMarkersFromLayer(layerId);
        this.removePolygonsFromLayer(layerId);
        this.removePolylinesFromLayer(layerId);
        this.removeOsmElementsFromLayer(layerId);
        this.removeMarkerCluster(layerId);
        this.removeRootLayer(layerId);
        this.removeOverpassLayer(layerId);
    }
}
