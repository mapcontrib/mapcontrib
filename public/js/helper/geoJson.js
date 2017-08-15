export default class GeoJsonHelper {
  /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} object.
     * @returns {number}
     */
  static findOsmId(object) {
    if (!object.properties) {
      return false;
    }

    if (!object.properties.id) {
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
  static findOsmType(object) {
    if (!object.properties) {
      return false;
    }

    if (!object.properties.type) {
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
  static findOsmVersion(object) {
    if (!object.properties) {
      return false;
    }

    if (!object.properties.meta) {
      return false;
    }

    if (!object.properties.meta.version) {
      return false;
    }

    return object.properties.meta.version;
  }

  /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} feature.
     * @param {object} overPassElement.
     * @returns {object}
     */
  static hydrateFeatureFromOverPassElement(feature, overPassElement) {
    const hydratedFeature = { ...feature };

    if (feature.properties.type === 'node') {
      hydratedFeature.geometry.coordinates = [
        overPassElement.lat,
        overPassElement.lon
      ];
    }

    if (overPassElement.tags) {
      if (!hydratedFeature.properties) {
        hydratedFeature.properties = {};
      }

      if (!hydratedFeature.properties.tags) {
        hydratedFeature.properties.tags = {};
      }

      hydratedFeature.properties.tags = {
        ...hydratedFeature.properties.tags,
        ...overPassElement.tags
      };
    }

    return hydratedFeature;
  }
}
