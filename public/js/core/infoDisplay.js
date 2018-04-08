import MarkedHelper from 'helper/marked';
import Locale from 'core/locale';
import CONST from 'const';

export default class InfoDisplay {
  /**
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {object} layerModel - Element's layer.
   * @param {object} feature - Element's geoJson representation.
   * @param {array} nonOsmTags - Non OSM tags related to the OSM element.
   * @param {boolean} feature - Is the user logged?
   * @returns {string}
   */
  static buildContent(themeModel, layerModel, feature, nonOsmTags) {
    let content = Locale.getLocalized(layerModel, 'popupContent');
    let data;

    if (!content) {
      return '';
    }

    content = MarkedHelper.render(content);

    if (layerModel.get('type') === CONST.layerType.overpass) {
      data = feature.properties.tags;
    } else if (feature.properties.tags) {
      data = feature.properties.tags;
    } else {
      data = feature.properties;
    }

    if (feature.properties.id) {
      content = content.replace(new RegExp('{id}', 'g'), feature.properties.id);
    }

    if (feature.properties.type) {
      content = content.replace(
        new RegExp('{@?type}', 'g'),
        feature.properties.type
      );
    }

    if (feature.id) {
      content = content.replace(new RegExp('{@id}', 'g'), feature.id);
    }

    content = content.replace(
      new RegExp('{@lat}', 'g'),
      feature.geometry.coordinates[1]
    );

    content = content.replace(
      new RegExp('{@(lon|lng)}', 'g'),
      feature.geometry.coordinates[0]
    );

    for (const i of Object.keys(nonOsmTags)) {
      const tag = nonOsmTags[i];
      const localizedValue = Locale.findLocalizedTagValue(
        themeModel.get('tags').models,
        tag.key,
        tag.value
      );

      content = content.replace(
        new RegExp(`{${tag.key}}`, 'g'),
        localizedValue
      );
    }

    for (const k of Object.keys(data)) {
      const localizedValue = Locale.findLocalizedTagValue(
        themeModel.get('tags').models,
        k,
        data[k]
      );

      content = content.replace(new RegExp(`{${k}}`, 'g'), localizedValue);
    }

    content = content.replace(/\{(.*?)\}/g, '');

    return content;
  }

  /**
   * Queries Overpass to fetch the direct relations of an OSM element
   * @param {string} endpoint - Overpass endpoint
   * @param {string} osmType
   * @param {string} osmId
   * @return {Promise}
   */
  static fetchDirectRelations(endpoint, osmType, osmId) {
    const relationsQuery = `
      [out:json];
      ${osmType}(${osmId});
      rel(bn);
      out tags;
    `;
    const url = `${endpoint}/interpreter?data=${encodeURI(relationsQuery)}`;

    return fetch(url, { method: 'GET' }).then(response => response.json());
  }

  /**
   * Queries Overpass to fetch the direct relations of an OSM element
   * Returns an html list of those relations
   * @param {string} endpoint - Overpass endpoint
   * @param {string} osmType
   * @param {string} osmId
   * @return {object}
   */
  static buildDirectRelationsList(document, endpoint, osmType, osmId) {
    return InfoDisplay.fetchDirectRelations(endpoint, osmType, osmId).then(
      response => {
        const ul = document.createElement('ul');

        for (const relation of response.elements) {
          const li = document.createElement('li');
          li.innerHTML = `
            <li>
              <a href="https://www.openstreetmap.org/${osmType}/${osmId}" target="_blank" rel="noopener noreferrer">
                ${relation.tags.name}
              </a>
            </li>
          `;
          ul.appendChild(li);
        }

        return ul;
      }
    );
  }
}
