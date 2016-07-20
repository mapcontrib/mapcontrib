

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
     * @returns {boolean}
     */
    exists (type, id) {
        const osmId = this._buildOsmIdFromTypeAndId(type, id);

        if ( this._osmData[osmId] ) {
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
     */
    save (osmElement) {
        const osmId = this._buildOsmIdFromElement(osmElement);

        this._osmData[osmId] = osmElement;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - OSM element's type.
     * @param {string|number} id - OSM element's id.
     */
    get (type, id) {
        const osmId = this._buildOsmIdFromTypeAndId(type, id);

        return this._osmData[osmId];
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
