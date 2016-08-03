

export default class OsmData {
    /**
     * @author Guillaume AMAT
     * @access public
     */
    constructor () {
        this._osmData = {};
    }


    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - OSM element's type.
     * @param {string|number} id - OSM element's id.
     * @param {string|number} layerId - OSM element's parent layer.
     * @returns {boolean}
     */
    exists (type, id, layerId) {
        const osmId = this._buildOsmIdFromTypeAndId(type, id);

        if ( !this._osmData[layerId] ) {
            return false;
        }

        if ( this._osmData[layerId][osmId] ) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - OSM element.
     * @param {string|number} layerId - OSM element's parent layer.
     * @returns {boolean}
     */
    save (osmElement, layerId) {
        const osmId = this._buildOsmIdFromElement(osmElement);

        if ( !this._osmData[layerId] ) {
            this._osmData[layerId] = {};
        }

        this._osmData[layerId][osmId] = osmElement;

        return true;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - OSM element's type.
     * @param {string|number} id - OSM element's id.
     * @param {string|number} layerId - OSM element's parent layer.
     * @returns {object|boolean}
     */
    get (type, id, layerId) {
        const osmId = this._buildOsmIdFromTypeAndId(type, id);

        if ( !this._osmData[layerId] ) {
            return false;
        }

        return this._osmData[layerId][osmId];
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - OSM element's type.
     * @param {string|number} id - OSM element's id.
     * @param {string|number} layerId - OSM element's parent layer.
     * @returns {boolean}
     */
    clearLayerData (layerId) {
        if ( !this._osmData[layerId] ) {
            return false;
        }

        this._osmData[layerId] = {};

        return true;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmElement - OSM element.
     * @returns {string}
     */
    _buildOsmIdFromElement (osmElement) {
        return `${osmElement.type}/${osmElement.id}`;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - OSM element's type.
     * @param {string|number} id - OSM element's id.
     * @returns {string}
     */
    _buildOsmIdFromTypeAndId (type, id) {
        return `${type}/${id}`;
    }
}
