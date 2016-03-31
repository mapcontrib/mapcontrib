
import { DOMImplementation, XMLSerializer } from 'xmldom';


/**
 * @param {object} osmAuth - Instance of osm-auth.
 */
export default class OsmEdit{

    constructor (osmAuth) {

        this._auth = osmAuth;
        this._changesetCreatedBy = null;
        this._changesetComment = null;
        this._lat = null;
        this._lng = null;
        this._tags = [];
        this._uid = null;
        this._timestamp = new Date().toISOString();
        this._displayName = null;
    }

    /**
     * @access public
     * @param {string} changesetCreatedBy - Application used to send datas to OSM (in the changeset).
     */
    setChangesetCreatedBy(changesetCreatedBy) {

        this._changesetCreatedBy = changesetCreatedBy;
    }

    /**
     * @access public
     * @param {string} changesetComment - Comment used in the changeset.
     */
    setChangesetComment(changesetComment) {

        this._changesetComment = changesetComment;
    }

    /**
     * @access public
     * @param {number} lat - Node's latitude.
     */
    setLatitude(lat) {

        this._lat = lat;
    }

    /**
     * @access public
     * @param {number} lon - Node's longitude.
     */
    setLongitude(lon) {

        this._lon = lon;
    }

    /**
     * @access public
     * @param {array} tags - Node's tags.
     */
    setTags(tags) {

        this._tags = tags;
    }

    /**
     * @access public
     * @param {string} uid - UID of the node's editor.
     */
    setUid(uid) {

        this._uid = uid;
    }

    /**
     * @access public
     * @param {string} timestamp - Timestamp of the node creation.
     */
    setTimestamp(timestamp) {

        this._timestamp = timestamp;
    }

    /**
     * @access public
     * @param {string} displayName - Display name of the node's editor.
     */
    setDisplayName(displayName) {

        this._displayName = displayName;
    }

    /**
     * Create a node in OSM
     * @access public
     * @returns {promise}
     */
    createNode() {

        return new Promise((resolve, reject) => {

            this._getChangesetId()
            .then(
                changesetId => {

                    return this._sendXml(changesetId);
                },
                err => {

                    reject(err);
                }
            )
            .then(
                nodeId => {

                    resolve(nodeId);
                },
                err => {

                    reject(err);
                }
            );
        });
    }



    /**
     * Builds a changeset XML.
     * @access private
     * @returns string
     */
    _buildChangesetXml() {

        var xml = new DOMImplementation().createDocument('', '', null),
        osmElement = xml.createElement('osm'),
        changesetElement = xml.createElement('changeset'),
        createdByElement = xml.createElement('tag'),
        commentElement = xml.createElement('tag');

        createdByElement.setAttribute('k', 'created_by');
        createdByElement.setAttribute('v', this._changesetCreatedBy);
        changesetElement.appendChild(createdByElement);

        commentElement.setAttribute('k', 'comment');
        commentElement.setAttribute('v', this._changesetComment);
        changesetElement.appendChild(commentElement);

        osmElement.appendChild(changesetElement);
        xml.appendChild(osmElement);

        return new XMLSerializer().serializeToString(xml);
    }



    /**
     * Builds a node XML.
     * @access private
     * @param {number} changesetId - The changeset ID used during the call to OSM.
     * @returns string
     */
    _buildNodeXml(changesetId) {

        var xml = new DOMImplementation().createDocument('', '', null),
        osmElement = xml.createElement('osm'),
        nodeElement = xml.createElement('node');

        nodeElement.setAttribute('changeset', changesetId);
        nodeElement.setAttribute('timestamp', this._timestamp);
        nodeElement.setAttribute('uid', this._uid);
        nodeElement.setAttribute('display_name', this._displayName);
        nodeElement.setAttribute('lat', this._lat);
        nodeElement.setAttribute('lon', this._lon);

        this._tags.forEach(tag => {

            if (!tag.key || !tag.value) {
                return false;
            }

            let tagElement = xml.createElement('tag');

            tagElement.setAttribute('k', tag.key);
            tagElement.setAttribute('v', tag.value);
            nodeElement.appendChild(tagElement);
        });

        osmElement.appendChild(nodeElement);
        xml.appendChild(osmElement);

        return new XMLSerializer().serializeToString(xml);
    }



    /**
     * Asks OSM to create a changeset and returns its ID
     * @access private
     * @returns {promise}
     */
    _createChangeset() {

        var changesetXml = this._buildChangesetXml(this._changesetCreatedBy, this._changesetComment);

        return new Promise((resolve, reject) => {

            this._auth.xhr({

                'method': 'PUT',
                'path': '/api/0.6/changeset/create',
                'options': {
                    'header': {
                        'Content-Type': 'text/xml'
                    }
                },
                'content': changesetXml
            },
            (err, changesetId) => {

                if (err) {

                    console.log('ERROR on put changeset: ' + err.response);
                    return reject(err);
                }

                resolve( parseInt(changesetId) );
            });
        });
    }



    /**
     * Check if a given changeset is still opened at OSM.
     * @access private
     * @param {number} changesetId - The changeset ID used during the call to OSM.
     * @returns {promise}
     */
    _isChangesetStillOpen(changesetId) {

        return new Promise((resolve, reject) => {

            this._auth.xhr({

                'method': 'GET',
                'path': '/api/0.6/changeset/'+ changesetId.toString(),
                'options': {
                    'header': {
                        'Content-Type': 'text/xml'
                    }
                },
            },
            (err, xml) => {

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
    }



    /**
     * Get a changeset ID from an old one or a creation.
     * @access private
     * @returns {promise}
     */
    _getChangesetId() {

        var changesetId = parseInt( sessionStorage.getItem('osmEdit-changesetId') );

        if ( changesetId ) {

            return this._isChangesetStillOpen(changesetId)
            .then(
                changesetId => {

                    return changesetId;
                },
                err => {

                    sessionStorage.removeItem('osmEdit-changesetId');
                    return this._getChangesetId();
                }
            );
        }
        else {

            return this._createChangeset()
            .then(
                changesetId => {

                    sessionStorage.setItem('osmEdit-changesetId', changesetId);
                    return changesetId;
                },
                err => {

                    sessionStorage.removeItem('osmEdit-changesetId');
                    return this._getChangesetId();
                }
            );
        }
    }



     /**
      * Send the node xml to OSM.
      * @access private
      * @param {number} changesetId - The changeset ID to use during the sending.
      * @returns {promise}
      */
     _sendXml(changesetId) {

         var data,
         xml = this._buildNodeXml(changesetId);

         return new Promise((resolve, reject) => {

             this._auth.xhr({

                 'method': 'PUT',
                 'path': '/api/0.6/node/create',
                 'options': {
                     'header': {
                         'Content-Type': 'text/xml'
                     }
                 },
                 'content': xml,
             },
             (err, nodeId) => {

                 if (err) {

                     reject(err);
                     return;
                 }

                 resolve(nodeId);
             });
         });
     }
}
