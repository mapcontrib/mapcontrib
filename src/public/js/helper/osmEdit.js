

define([],
function () {

    'use strict';

    /**
     * @param {object} osmAuth - Instance of osm-auth.
     */
    function OsmEdit (osmAuth) {

        this._auth = osmAuth;
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



    /**
     * Builds the changeset XML to send to OSM
     * @param {string} createBy - Software used to create the changese.t
     * @param {string} comment - Comment added to the changeset.
     * @returns string
     */
    OsmEdit.prototype.buildChangesetXml = function (createBy, comment) {

        var xml = document.implementation.createDocument('', '', null),
        osmElement = xml.createElement('osm'),
        changesetElement = xml.createElement('changeset'),
        createdByElement = xml.createElement('tag'),
        commentElement = xml.createElement('tag');

        createdByElement.setAttribute('k', 'created_by');
        createdByElement.setAttribute('v', createBy);

        commentElement.setAttribute('k', 'comment');
        commentElement.setAttribute('v', comment);

        changesetElement.appendChild(createdByElement);
        changesetElement.appendChild(commentElement);
        osmElement.appendChild(changesetElement);
        xml.appendChild(osmElement);

        return new XMLSerializer().serializeToString(xml);
    };



    /**
     * Asks OSM to create a changeset and returns its ID
     */
    OsmEdit.prototype.createChangeset = function (changesetXml) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self._auth.xhr({

                'method': 'PUT',
                'path': '/api/0.6/changeset/create',
                'options': {
                    'header': {
                        'Content-Type': 'text/xml'
                    }
                },
                'content': changesetXml
            },
            function(err, changesetId) {

                if (err) {

                    console.log('ERROR on put changeset: ' + err.response);
                    return reject(err);
                }

                resolve( parseInt(changesetId) );
            });
        });
    };



    /**
     * Retrieves a changeset from OSM.
     * @param {string} changesetId
     */
    OsmEdit.prototype.checkChangeset = function (changesetId) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self._auth.xhr({

                'method': 'GET',
                'path': '/api/0.6/changeset/'+ changesetId.toString(),
                'options': {
                    'header': {
                        'Content-Type': 'text/xml'
                    }
                },
            },
            function(err, xml) {

                if (err) {

                    return reject(err);
                }

                var isOpened = xml.getElementsByTagName('changeset')[0].getAttribute('open');

                if (isOpened === 'false') {

                    return reject(err);
                }

                resolve(changesetId);
            });
        });
    };



    return OsmEdit;
});
