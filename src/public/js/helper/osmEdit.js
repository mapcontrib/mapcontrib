
import _ from 'underscore';
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

        this._floatAttributes = [ 'lat', 'lon' ];
        this._intAttributes = [ 'id', 'uid', 'version', 'changeset' ];

        this._resetElement();
    }

    _resetElement () {
        this._element = {
            'type': undefined,
            'attributes': {},
            'tags': [],
            'nds': [],
            'members': [],
        };
    }


    /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} element.
     */
    setElement(element) {
        this._element = element;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {object}
     */
    getElement() {
        return this._element;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {object}
     */
    getOverPassElement() {
        let element = _.extend(
            {
                'type': this._element.type,
                'tags': {}
            },
            this._element.attributes
        );

        for (let i in this._element.tags) {
            let key = this._element.tags[i].k;
            let value = this._element.tags[i].v;
            element.tags[ key ] = value;
        }

        return element;
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
        this._element.attributes.lat = lat;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {number}
     */
    getLatitude() {
        return this._element.attributes.lat;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {number} lon - Node's longitude.
     */
    setLongitude(lon) {
        this._element.attributes.lon = lon;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {number}
     */
    getLongitude() {
        return this._element.attributes.lon;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {array} tags - Node's tags.
     */
    setTags(tags) {
        this._element.tags = [];

        for (let key in tags) {
            if (tags.hasOwnProperty(key)) {
                this._element.tags.push({
                    'k': key,
                    'v': tags[key],
                });
            }
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {array}
     */
    getTags() {
        let tags = {};

        for (let tag of this._element.tags) {
            tags[ tag.k ] = tag.v;
        }

        return tags;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} uid - UID of the node's editor.
     */
    setUid(uid) {
        this._element.attributes.uid = uid;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getUid() {
        return this._element.attributes.uid;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} type - Element's type.
     */
    setType(type) {
        this._element.type = type;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getType() {
        return this._element.type;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} id - Element's ID.
     */
    setId(id) {
        this._element.attributes.id = id;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getId() {
        return this._element.attributes.id;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} timestamp - Timestamp of the node creation.
     */
    setTimestamp(timestamp) {
        if ( !timestamp ) {
            this._element.attributes.timestamp = new Date().toISOString();
        }
        else {
            this._element.attributes.timestamp = timestamp;
        }
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getTimestamp() {
        return this._element.attributes.timestamp;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string|number} version - Element's version.
     */
    setVersion(version) {
        this._element.attributes.version = version;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string|number}
     */
    getVersion() {
        return this._element.attributes.version;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} displayName - Display name of the node's editor.
     */
    setDisplayName(displayName) {
        this._element.attributes.display_name = displayName;
    }

    /**
     * @author Guillaume AMAT
     * @access public
     * @return {string}
     */
    getDisplayName() {
        return this._element.attributes.display_name;
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
        if ( !type ) {
            type = this._element.type;
        }

        if ( !id ) {
            id = this._element.attributes.id;
        }

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
                    let parentElement = xml.getElementsByTagName(type)[0],
                    tagElements = parentElement.getElementsByTagName('tag'),
                    ndElements = parentElement.getElementsByTagName('nd'),
                    memberElements = parentElement.getElementsByTagName('member');

                    this._resetElement();

                    this.setType( parentElement.tagName );

                    for (let i = 0; i < parentElement.attributes.length; i++){
                        let att = parentElement.attributes[i];
                        let key = att.nodeName;
                        let value = att.nodeValue;

                        if ( this._intAttributes.indexOf(att.nodeName) > -1 ) {
                            value = parseInt(value);
                        }
                        else if ( this._floatAttributes.indexOf(att.nodeName) > -1 ) {
                            value = parseFloat(value);
                        }

                        this._element.attributes[key] = value;
                    }


                    if (tagElements.length > 0) {
                        for (let i in tagElements) {
                            if (tagElements.hasOwnProperty(i)) {
                                this._element.tags.push({
                                    'k': tagElements[i].getAttribute('k'),
                                    'v': tagElements[i].getAttribute('v'),
                                });
                            }
                        }
                    }

                    if (ndElements.length > 0) {
                        for (let i in ndElements) {
                            if (ndElements.hasOwnProperty(i)) {
                                this._element.nds.push({
                                    'ref': ndElements[i].getAttribute('ref'),
                                });
                            }
                        }
                    }

                    if (memberElements.length > 0) {
                        for (let i in memberElements) {
                            if (memberElements.hasOwnProperty(i)) {
                                const role = memberElements[i].getAttribute('role');
                                let data = {
                                    'type': memberElements[i].getAttribute('type'),
                                    'ref': memberElements[i].getAttribute('ref'),
                                };

                                if (role) {
                                    data.role = role;
                                }

                                this._element.members.push(data);
                            }
                        }
                    }

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
        parentElement = xml.createElement(this._element.type);

        delete this._element.attributes.user;

        this._element.attributes.changeset = changesetId;

        for (let key in this._element.attributes) {
            parentElement.setAttribute(key, this._element.attributes[key]);
        }

        for (let tag of this._element.tags) {
            let tagElement = xml.createElement('tag');

            tagElement.setAttribute('k', tag.k);
            tagElement.setAttribute('v', tag.v);
            parentElement.appendChild(tagElement);
        }

        for (let nd of this._element.nds) {
            let ndElement = xml.createElement('nd');

            ndElement.setAttribute('ref', nd.ref);
            parentElement.appendChild(ndElement);
        }

        for (let member of this._element.members) {
            let memberElement = xml.createElement('member');

            memberElement.setAttribute('type', member.type);
            memberElement.setAttribute('ref', member.ref);

            if (member.role) {
                memberElement.setAttribute('role', member.role);
            }

            parentElement.appendChild(memberElement);
        }

        osmElement.appendChild(parentElement);
        xml.appendChild(osmElement);

        console.log(new XMLSerializer().serializeToString(xml));
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
        path = `/api/0.6/${this._element.type}/create`,
        xml = this._buildXml(changesetId);

        if (this._element.attributes.id) {
            path = `/api/0.6/${this._element.type}/${this._element.attributes.id}`;
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



     /**
      * Puts the OsmEdit informations in an OverPass object.
      *
      * @author Guillaume AMAT
      * @access public
      * @param {object} overPassObject.
      * @return {object}
      */
    hydrateOverPassObject(overPassObject) {
        delete overPassObject.user;

        overPassObject.type = this._element.type;

        for (let key in this._element.attributes) {
            overPassObject[key] = this._element.attributes[key];
        }

        overPassObject.tags = {};

        for (let tag of this._element.tags) {
            overPassObject.tags[tag.k] = tag.v;
        }

        if (this._element.type !== 'node') {
            overPassObject.nodes = [];

            for (let nd of this._element.nds) {
                overPassObject.nodes.push(nd.ref);
            }
        }

        if (this._element.type === 'relation') {
            overPassObject.members = [];

            for (let member of this._element.members) {
                let data = {
                    'type': member.type,
                    'ref': member.ref,
                };

                if (member.role) {
                    data.role = member.role;
                }

                overPassObject.members.push(data);
            }
        }

        return overPassObject;
    }
}
