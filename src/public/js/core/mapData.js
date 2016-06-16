
import _ from 'underscore';


export default class MapData {
    constructor () {
        this._markers = {};
        this._polygons = {};
        this._polylines = {};
        this._markerClusters = {};
        this._osmElements = {};
        this._rootLayers = {};
        this._overPassLayers = {};
    }

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

    _setObjectToCollection (object, collection, osmElement, layerId) {
        if (!collection[layerId]) {
            collection[layerId] = {};
        }

        if (!collection[layerId][osmElement.type]) {
            collection[layerId][osmElement.type] = {};
        }

        collection[layerId][osmElement.type][osmElement.id] = object;
    }

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

    addMarker (marker, osmElement, layerId) {
        this._addObjectToListCollection(
            marker,
            this._markers,
            osmElement,
            layerId
        );
    }

    addPolygon (polygon, osmElement, layerId) {
        this._addObjectToListCollection(
            polygon,
            this._polygons,
            osmElement,
            layerId
        );
    }

    addPolyline (polyline, osmElement, layerId) {
        this._addObjectToListCollection(
            polyline,
            this._polylines,
            osmElement,
            layerId
        );
    }

    setOsmElement (e, layerId) {
        this._setObjectToCollection(
            e,
            this._osmElements,
            e,
            layerId
        );
    }

    setMarkerCluster (markerCluster, layerId) {
        this._markerClusters[layerId] = markerCluster;
    }

    setRootLayer (rootLayer, layerId) {
        this._rootLayers[layerId] = rootLayer;
    }

    setOverpassLayer (overPassLayer, layerId) {
        this._overPassLayers[layerId] = overPassLayer;
    }

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

    getMarkersFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._markers[layerId]
        );
    }

    getMarkersFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._markers, osmElement, layerId);
    }

    getPolygonsFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._polygons[layerId]
        );
    }

    getPolygonsFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._polygons, osmElement, layerId);
    }

    getPolylinesFromLayer (layerId) {
        return this._joinCollectionTypes(
            this._polylines[layerId]
        );
    }

    getPolylinesFromOsmElement (osmElement, layerId) {
        return this._getFromCollection(this._polylines, osmElement, layerId);
    }

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


    getObjectsFromOsmElement (osmElement, layerId) {
        return _.union(
            this._getFromCollection(this._markers, osmElement, layerId),
            this._getFromCollection(this._polygons, osmElement, layerId),
            this._getFromCollection(this._polylines, osmElement, layerId)
        );
    }

    getMarkerCluster (layerId) {
        return this._markerClusters[layerId];
    }

    getOsmElements (layerId) {
        return this._osmElements[layerId];
    }

    getOsmElement (elementId, elementType, layerId) {
        if (this._osmElements[layerId]) {
            if (this._osmElements[layerId][ elementType ]) {
                return this._osmElements[layerId][elementType][elementId];
            }
        }
    }

    getRootLayer (layerId) {
        return this._rootLayers[layerId];
    }

    getOverpassLayer (layerId) {
        return this._overPassLayers[layerId];
    }

    _removeFromCollection (e, collection, layerId) {
        if (collection[layerId]) {
            if (collection[layerId][e.type]) {
                if (collection[layerId][e.type][e.id]) {
                    delete collection[layerId][e.type][e.id];
                }
            }
        }
    }

    removeMarkersFromLayer (layerId) {
        if (this._markers[layerId]) {
            delete this._markers[layerId];
        }
    }

    removeMarkersFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._markers, layerId);
    }

    removePolygonsFromLayer (layerId) {
        if (this._polygons[layerId]) {
            delete this._polygons[layerId];
        }
    }

    removePolygonsFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._polygons, layerId);
    }

    removePolylinesFromLayer (layerId) {
        if (this._polylines[layerId]) {
            delete this._polylines[layerId];
        }
    }

    removePolylinesFromOsmElement (e, layerId) {
        this._removeFromCollection(e, this._polylines, layerId);
    }

    removeMarkerCluster (layerId) {
        if (this._markerClusters[layerId]) {
            delete this._markerClusters[layerId];
        }
    }

    removeOsmElementsFromLayer (layerId) {
        if (this._osmElements[layerId]) {
            delete this._osmElements[layerId];
        }
    }

    removeOsmElement (e, layerId) {
        this._removeFromCollection(e, this._osmElements, layerId);
    }

    removeRootLayer (rootLayer, layerId) {
        if (this._rootLayers[layerId]) {
            delete this._rootLayers[layerId];
        }
    }

    removeOverpassLayer (overPassLayer, layerId) {
        if (this._overPassLayers[layerId]) {
            delete this._overPassLayers[layerId];
        }
    }

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
