

define([],
function () {

    'use strict';

    function OsmEdit () {

        this._lat = null;
        this._lng = null;
        this._tags = [];
    }



    /**
     * Create a node in OSM
     * @param {object} attributes - Node's attributes (eg: lat, lng, tags).
     * @param {createCallback} [callback] - Callback called after the request.
     * @returns boolean
     */
    OsmEdit.prototype.createNode = function (attributes, callback) {

        if ( callback ) {

            callback(null);
        }

        return false;
    };
    /**
     * Callback called after the creation request.
     * @callback createCallback
     * @param {?string} err
     */


    return OsmEdit;
});
