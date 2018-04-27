export default class OverPassData {
  /**
   * @author Guillaume AMAT
   * @access public
   */
  constructor() {
    this._overPassData = {};
  }

  /**
   * @author Guillaume AMAT
   * @access public
   * @param {string} type - OverPass element's type.
   * @param {string|number} id - OverPass element's id.
   * @param {string|number} layerId - OverPass element's parent layer.
   * @returns {boolean}
   */
  exists(type, id, layerId) {
    const osmId = OverPassData.buildOsmIdFromTypeAndId(type, id);

    if (!this._overPassData[layerId]) {
      return false;
    }

    if (this._overPassData[layerId][osmId]) {
      return true;
    }

    return false;
  }

  /**
   * @author Guillaume AMAT
   * @access public
   * @param {object} overPassElement - OverPass element.
   * @param {string|number} layerId - OverPass element's parent layer.
   * @returns {boolean}
   */
  save(overPassElement, layerId) {
    const osmId = OverPassData.buildOsmIdFromElement(overPassElement);

    if (!this._overPassData[layerId]) {
      this._overPassData[layerId] = {};
    }

    this._overPassData[layerId][osmId] = overPassElement;

    return true;
  }

  /**
   * @author Guillaume AMAT
   * @access public
   * @param {object} overPassElement - OverPass element.
   * @param {string|number} layerId - OverPass element's parent layer.
   * @returns {boolean}
   */
  remove(overPassElement, layerId) {
    const osmId = OverPassData.buildOsmIdFromElement(overPassElement);

    delete this._overPassData[layerId][osmId];

    return true;
  }

  /**
   * @author Guillaume AMAT
   * @access public
   * @param {string} type - OverPass element's type.
   * @param {string|number} id - OverPass element's id.
   * @param {string|number} layerId - OverPass element's parent layer.
   * @returns {object|boolean}
   */
  get(type, id, layerId) {
    const osmId = OverPassData.buildOsmIdFromTypeAndId(type, id);

    if (!this._overPassData[layerId]) {
      return false;
    }

    return this._overPassData[layerId][osmId];
  }

  /**
   * @author Guillaume AMAT
   * @access public
   * @param {string} type - OverPass element's type.
   * @param {string|number} id - OverPass element's id.
   * @param {string|number} layerId - OverPass element's parent layer.
   * @returns {boolean}
   */
  clearLayerData(layerId) {
    if (!this._overPassData[layerId]) {
      return false;
    }

    this._overPassData[layerId] = {};

    return true;
  }

  /**
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {object} overPassElement - OverPass element.
   * @returns {string}
   */
  static buildOsmIdFromElement(overPassElement) {
    return `${overPassElement.type}/${overPassElement.id}`;
  }

  /**
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {string} type - OverPass element's type.
   * @param {string|number} id - OverPass element's id.
   * @returns {string}
   */
  static buildOsmIdFromTypeAndId(type, id) {
    return `${type}/${id}`;
  }
}
