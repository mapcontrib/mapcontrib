
export default class GeoJsonHelper {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} object.
     * @returns {number}
     */
    static findOsmId (object) {
        if ( !object.properties) {
            return false;
        }

        if ( !object.properties.id) {
            return false;
        }

        return object.properties.id;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} object.
     * @returns {string}
     */
    static findOsmType (object) {
        if ( !object.properties) {
            return false;
        }

        if ( !object.properties.type) {
            return false;
        }

        return object.properties.type;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} object.
     * @returns {number}
     */
    static findOsmVersion (object) {
        if ( !object.properties) {
            return false;
        }

        if ( !object.properties.meta) {
            return false;
        }

        if ( !object.properties.meta.version) {
            return false;
        }

        return object.properties.meta.version;
    }
}
