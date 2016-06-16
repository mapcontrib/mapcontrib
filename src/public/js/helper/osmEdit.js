
import { DOMImplementation, XMLSerializer } from 'xmldom';


export default class OsmEdit{
    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmAuth - Instance of osm-auth.
     */
    constructor (osmAuth) {
        this._auth = osmAuth;
        this._changesetCreatedBy = null;
        this._changesetComment = null;
        this._lat = null;
        this._lon = null;
        this._tags = [];
        this._uid = null;
        this._version = 0;
        this._id = null;
        this._type = 'node';
        this._timestamp = new Date().toISOString();
        this._displayName = null;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} changesetCreatedBy - Application used to send datas to OSM (in the changeset).
     */
    setChangesetCreatedBy(changesetCreatedBy) {
        this._changesetCreatedBy = changesetCreatedBy;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getChangesetCreatedBy() {
        return this._changesetCreatedBy;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} changesetComment - Comment used in the changeset.
     */
    setChangesetComment(changesetComment) {
        this._changesetComment = changesetComment;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getChangesetComment() {
        return this._changesetComment;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} lat - Node's latitude.
     */
    setLatitude(lat) {
        this._lat = lat;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {number}
     */
    getLatitude() {
        return this._lat;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} lon - Node's longitude.
     */
    setLongitude(lon) {
        this._lon = lon;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {number}
     */
    getLongitude() {
        return this._lon;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {array} tags - Node's tags.
     */
    setTags(tags) {
        this._tags = tags;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {array}
     */
    getTags() {
        return this._tags;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} uid - UID of the node's editor.
     */
    setUid(uid) {
        this._uid = uid;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getUid() {
        return this._uid;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - Element's type.
     */
    setType(type) {
        this._type = type;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getType() {
        return this._type;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} id - Element's ID.
     */
    setId(id) {
        this._id = id;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getId() {
        return this._id;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} timestamp - Timestamp of the node creation.
     */
    setTimestamp(timestamp) {
        this._timestamp = timestamp;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getTimestamp() {
        return this._timestamp;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} version - Element's version.
     */
    setVersion(version) {
        this._version = version;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getVersion() {
        return this._version;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} displayName - Display name of the node's editor.
     */
    setDisplayName(displayName) {
        this._displayName = displayName;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getDisplayName() {
        return this._displayName;
    }


    /**
     * Fetch an element from OSM.
     *
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @return {promise}
     */
    fetch(type, id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                'method': 'GET',
                'dataType': 'xml',
                'url': `https://api.openstreetmap.org/api/0.6/${type}/${id}`,
                'error': (jqXHR, textStatus, errorThrown) => {
                    console.error(`ERROR on fetch element: ${errorThrown}`);
                    return reject(errorThrown);
                },
                'success': (xml, jqXHR, textStatus) => {
                    let key, value,
                    tags = {},
                    parentElement = xml.getElementsByTagName(type)[0],
                    tagElements = xml.documentElement.getElementsByTagName('tag'),
                    version = parseInt( parentElement.getAttribute('version') );

                    for (let index in tagElements) {
                        let tag = tagElements[index];

                        if ( tag.getAttribute ) {
                            key = tag.getAttribute('k');
                            value = tag.getAttribute('v');
                            tags[ key ] = value;
                        }
                    }

                    this.setVersion(version);
                    this.setTags(tags);

                    resolve(this);
                }
            });
        });
    }



    /**
     * Sends the node to OSM.
     *
     * @author Guillaume AMAT
     * @access public
     * @return {promise}
     */
    send() {
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
                version => {
                    resolve(version);
                },
                err => {
                    reject(err);
                }
            );
        });
    }



    /**
     * Builds a changeset XML.
     *
     * @author Guillaume AMAT
     * @access private
     * @return {string} - The changeset XML.
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
     *
     * @author Guillaume AMAT
     * @access private
     * @param {number} changesetId - The changeset ID used during the call to OSM.
     * @return {string} - The node XML.
     */
    _buildXml(changesetId) {
        var xml = new DOMImplementation().createDocument('', '', null),
        osmElement = xml.createElement('osm'),
        nodeElement = xml.createElement('node');

        if (this._id) {
            nodeElement.setAttribute('id', this._id);
        }

        nodeElement.setAttribute('changeset', changesetId);
        nodeElement.setAttribute('version', this._version);
        nodeElement.setAttribute('timestamp', this._timestamp);
        nodeElement.setAttribute('uid', this._uid);
        nodeElement.setAttribute('display_name', this._displayName);
        nodeElement.setAttribute('lat', this._lat);
        nodeElement.setAttribute('lon', this._lon);

        for (let key in this._tags) {
            let tagElement = xml.createElement('tag');

            tagElement.setAttribute('k', key);
            tagElement.setAttribute('v', this._tags[key]);
            nodeElement.appendChild(tagElement);
        }

        osmElement.appendChild(nodeElement);
        xml.appendChild(osmElement);

        return new XMLSerializer().serializeToString(xml);
    }



    /**
     * Asks OSM to create a changeset and return its ID.
     *
     * @author Guillaume AMAT
     * @access private
     * @return {promise}
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
                    console.error('ERROR on put changeset: ' + err.response);
                    return reject(err);
                }

                resolve( parseInt(changesetId) );
            });
        });
    }



    /**
     * Checks if a given changeset is still opened at OSM.
     *
     * @author Guillaume AMAT
     * @access private
     * @param {number} changesetId - The changeset ID used during the call to OSM.
     * @return {promise}
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
     * Gets a changeset ID from an old one or a creation.
     *
     * @author Guillaume AMAT
     * @access private
     * @return {promise}
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
      * Sends the node xml to OSM.
      *
      * @author Guillaume AMAT
      * @access private
      * @param {number} changesetId - The changeset ID to use during the sending.
      * @return {promise}
      */
    _sendXml(changesetId) {
        var data,
        method = 'PUT',
        path = `/api/0.6/${this._type}/create`,
        xml = this._buildXml(changesetId);

        if (this._id) {
            path = `/api/0.6/${this._type}/${this._id}`;
        }

        return new Promise((resolve, reject) => {
            this._auth.xhr({
                'method': method,
                'path': path,
                'options': {
                    'header': {
                        'Content-Type': 'text/xml'
                    }
                },
                'content': xml,
            },
            (err, version) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(version);
            });
        });
    }
}
