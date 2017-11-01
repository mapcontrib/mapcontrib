import { DOMImplementation, XMLSerializer } from 'xmldom';

export default class OsmEdit {
  /**
     * @author Guillaume AMAT
     * @access public
     * @param {object} osmAuth - Instance of osm-auth.
     */
  constructor(osmAuth) {
    this._auth = osmAuth;
    this._changesetCreatedBy = null;
    this._changesetComment = null;

    this._floatAttributes = ['lat', 'lon'];
    this._intAttributes = ['id', 'uid', 'version', 'changeset'];

    this._resetElement();
  }

  _resetElement() {
    this._element = {
      type: undefined,
      attributes: {},
      tags: [],
      nodes: [],
      members: []
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
    return OsmEdit._buildCleanedElement(this._element);
  }

  /**
     * @author Guillaume AMAT
     * @access public
     * @return {object}
     */
  getOverPassElement() {
    const element = {
      type: this._element.type,
      nodes: this._element.nodes,
      members: this._element.members,
      tags: {},
      ...this._element.attributes
    };

    for (const i in this._element.tags) {
      if ({}.hasOwnProperty.call(this._element.tags, i)) {
        const key = this._element.tags[i].k;
        const value = this._element.tags[i].v;
        element.tags[key] = value;
      }
    }

    return OsmEdit._buildCleanedElement(element);
  }

  /**
     * @author Guillaume AMAT
     * @access public
     * @param {string} changesetCreatedBy - Application used to send datas (in the changeset).
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
     * @param {array} nodes - List of nodes' id.
     */
  setNodes(nodes) {
    this._element.nodes = nodes;
  }

  /**
     * @author Guillaume AMAT
     * @access public
     * @return {array}
     */
  getNodes() {
    return this._element.nodes;
  }

  /**
     * @author Guillaume AMAT
     * @access public
     * @param {array} members - List of members objects.
     */
  setMembers(members) {
    this._element.members = members;
  }

  /**
     * @author Guillaume AMAT
     * @access public
     * @return {array}
     */
  getMembers() {
    return this._element.members;
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

    for (const key in tags) {
      if ({}.hasOwnProperty.call(tags, key)) {
        this._element.tags.push({
          k: key,
          v: tags[key]
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
    const tags = {};

    for (const tag of this._element.tags) {
      tags[tag.k] = tag.v;
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
    if (!timestamp) {
      this._element.attributes.timestamp = new Date().toISOString();
    } else {
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
    if (!type) {
      type = this._element.type;
    }

    if (!id) {
      id = this._element.attributes.id;
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        dataType: 'xml',
        url: `https://api.openstreetmap.org/api/0.6/${type}/${id}`,
        error: (jqXHR, textStatus, errorThrown) => {
          console.error(`ERROR on fetch element: ${errorThrown}`);
          return reject(errorThrown);
        },
        success: xml => {
          const parentElement = xml.getElementsByTagName(type)[0];
          const tagElements = parentElement.getElementsByTagName('tag');
          const ndElements = parentElement.getElementsByTagName('nd');
          const memberElements = parentElement.getElementsByTagName('member');

          this._resetElement();

          this.setType(parentElement.tagName);

          for (let i = 0; i < parentElement.attributes.length; i += 1) {
            const att = parentElement.attributes[i];
            const key = att.nodeName;
            let value = att.nodeValue;

            if (this._intAttributes.indexOf(att.nodeName) > -1) {
              value = parseInt(value, 10);
            } else if (this._floatAttributes.indexOf(att.nodeName) > -1) {
              value = parseFloat(value);
            }

            this._element.attributes[key] = value;
          }

          if (tagElements.length > 0) {
            for (const i in tagElements) {
              if ({}.hasOwnProperty.call(tagElements, i)) {
                this._element.tags.push({
                  k: tagElements[i].getAttribute('k'),
                  v: tagElements[i].getAttribute('v')
                });
              }
            }
          }

          if (ndElements.length > 0) {
            for (const i in ndElements) {
              if ({}.hasOwnProperty.call(ndElements, i)) {
                this._element.nodes.push(ndElements[i].getAttribute('ref'));
              }
            }
          }

          if (memberElements.length > 0) {
            for (const i in memberElements) {
              if ({}.hasOwnProperty.call(memberElements, i)) {
                const role = memberElements[i].getAttribute('role');
                const data = {
                  type: memberElements[i].getAttribute('type'),
                  ref: memberElements[i].getAttribute('ref')
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
          changesetId => this._sendXml(changesetId),
          err => {
            reject(err);
          }
        )
        .then(
          response => {
            resolve(response);
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
    const xml = new DOMImplementation().createDocument('', '', null);
    const osmElement = xml.createElement('osm');
    const changesetElement = xml.createElement('changeset');
    const createdByElement = xml.createElement('tag');
    const commentElement = xml.createElement('tag');

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
    const xml = new DOMImplementation().createDocument('', '', null);
    const osmElement = xml.createElement('osm');
    const parentElement = xml.createElement(this._element.type);

    delete this._element.attributes.user;

    this._element.attributes.changeset = changesetId;

    for (const key in this._element.attributes) {
      if ({}.hasOwnProperty.call(this._element.attributes, key)) {
        parentElement.setAttribute(key, this._element.attributes[key]);
      }
    }

    for (const tag of this._element.tags) {
      const tagElement = xml.createElement('tag');

      tagElement.setAttribute('k', tag.k);
      tagElement.setAttribute('v', tag.v);
      parentElement.appendChild(tagElement);
    }

    if (this._element.nodes) {
      for (const nodeId of this._element.nodes) {
        const ndElement = xml.createElement('nd');

        ndElement.setAttribute('ref', nodeId);
        parentElement.appendChild(ndElement);
      }
    }

    if (this._element.members) {
      for (const member of this._element.members) {
        const memberElement = xml.createElement('member');

        memberElement.setAttribute('type', member.type);
        memberElement.setAttribute('ref', member.ref);

        if (member.role) {
          memberElement.setAttribute('role', member.role);
        }

        parentElement.appendChild(memberElement);
      }
    }

    osmElement.appendChild(parentElement);
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
    const changesetXml = this._buildChangesetXml(
      this._changesetCreatedBy,
      this._changesetComment
    );

    return new Promise((resolve, reject) => {
      this._auth.xhr(
        {
          method: 'PUT',
          path: '/api/0.6/changeset/create',
          options: {
            header: {
              'Content-Type': 'text/xml'
            }
          },
          content: changesetXml
        },
        (err, changesetId) => {
          if (err) {
            console.error(`ERROR on put changeset: ${err.response}`);
            return reject(err);
          }

          return resolve(parseInt(changesetId, 10));
        }
      );
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
      this._auth.xhr(
        {
          method: 'GET',
          path: `/api/0.6/changeset/${changesetId.toString()}`,
          options: {
            header: {
              'Content-Type': 'text/xml'
            }
          }
        },
        (err, xml) => {
          if (err) {
            return reject(err);
          }

          const isOpened = xml
            .getElementsByTagName('changeset')[0]
            .getAttribute('open');

          if (isOpened === 'false') {
            return reject(err);
          }

          return resolve(changesetId);
        }
      );
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
    const changesetId = parseInt(
      sessionStorage.getItem('osmEdit-changesetId'),
      10
    );

    if (changesetId) {
      return this._isChangesetStillOpen(changesetId).then(
        id => id,
        () => {
          sessionStorage.removeItem('osmEdit-changesetId');
          return this._getChangesetId();
        }
      );
    }

    return this._createChangeset().then(
      id => {
        sessionStorage.setItem('osmEdit-changesetId', id);
        return id;
      },
      () => {
        sessionStorage.removeItem('osmEdit-changesetId');
        return this._getChangesetId();
      }
    );
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
    const method = 'PUT';
    const xml = this._buildXml(changesetId);
    let path = `/api/0.6/${this._element.type}/create`;

    if (this._element.attributes.id) {
      path = `/api/0.6/${this._element.type}/${this._element.attributes.id}`;
    }

    return new Promise((resolve, reject) => {
      this._auth.xhr(
        {
          method,
          path,
          options: {
            header: {
              'Content-Type': 'text/xml'
            }
          },
          content: xml
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(response);
        }
      );
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

    for (const key in this._element.attributes) {
      if ({}.hasOwnProperty.call(this._element.attributes, key)) {
        overPassObject[key] = this._element.attributes[key];
      }
    }

    overPassObject.tags = {};

    for (const tag of this._element.tags) {
      overPassObject.tags[tag.k] = tag.v;
    }

    if (this._element.type === 'way') {
      overPassObject.nodes = [...this._element.nodes];
    }

    if (this._element.type === 'relation') {
      overPassObject.members = [...this._element.members];
    }

    return overPassObject;
  }

  /**
     * Removes the nodes and/or members attributes from the element when needed.
     *
     * @author Guillaume AMAT
     * @access private
     * @param {object} element - An OverPass or OSM element.
     * @return {object}
     */
  static _buildCleanedElement(element) {
    const cleanedElement = { ...element };

    if (element.type !== 'relation') {
      delete cleanedElement.members;
    }

    if (element.type !== 'way') {
      delete cleanedElement.nodes;
    }

    return cleanedElement;
  }
}
