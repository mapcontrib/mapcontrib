import Diacritics from 'diacritic';

export default class Theme {
  /**
   * Returns a URL-friendly name of the theme.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {string} nameArg
   * @return {string}
   */
  static buildWebLinkName(nameArg) {
    let name = nameArg || '';

    name = Diacritics.clean(name);
    name = name.replace(/-/g, '_');
    name = name.replace(/ /g, '_');
    name = name.replace(/_{2,}/g, '_');
    name = name.replace(/[^a-zA-Z0-9_]/g, '');

    return name;
  }

  /**
   * Returns the theme path.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {string} fragment
   * @param {string} name
   * @return {string}
   */
  static buildPath(fragment, name) {
    const basePath = `/t/${fragment}`;
    const webName = this.buildWebLinkName(name);

    if (webName) {
      return `${basePath}-${webName}`;
    }

    return basePath;
  }

  /**
   * Returns the theme url.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {object} window - The browser's window object
   * @param {string} fragment
   * @param {string} name
   * @return {string}
   */
  static buildUrl(window, fragment, name) {
    const urlParts = [
      window.location.protocol,
      '//',
      window.location.host,
      this.buildPath(fragment, name)
    ];

    return urlParts.join('');
  }

  /**
   * Returns a hash with the current map position.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {L.Map} map
   * @return {string}
   */
  static buildMapPositionHash(map) {
    const zoom = map.getZoom();
    const { lat, lng } = map.getCenter();

    return `#position/${zoom}/${lat}/${lng}`;
  }

  /**
   * Returns a hash with the a layer position.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {L.Layer} layer
   * @return {string}
   */
  static buildLayerPositionHash(zoom, layer) {
    const { lat, lng } = layer.getLatLng();

    return `#position/${zoom}/${lat}/${lng}`;
  }

  /**
   * Tells if a user is the owner of the theme.
   *
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {object} theme - The theme
   * @param {string} userId
   * @param {string} osmId
   * @return {boolean}
   */
  static isThemeOwner(theme, userId, osmId) {
    if (theme.userId === userId) {
      return true;
    }

    if (theme.owners.indexOf(userId) !== -1) {
      return true;
    }

    if (theme.owners.indexOf('*') !== -1) {
      return true;
    }

    if (theme.osmOwners) {
      if (theme.osmOwners.indexOf(osmId) !== -1) {
        return true;
      }

      if (theme.osmOwners.indexOf('*') !== -1) {
        return true;
      }
    }

    return false;
  }
}
