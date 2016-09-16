
import MarkedHelper from 'helper/marked';
import CONST from 'const';

export default class InfoDisplay {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} content - A popup content.
     * @returns {Array}
     */
    static findTagsFromContent(content) {
        const re = new RegExp('{(.*?)}', 'g');
        const matches = content.match(re);
        const tags = [];

        if (!matches) {
            return [];
        }

        for (const rawTag of matches) {
            tags.push(
                rawTag.replace( /\{(.*?)\}/g, '$1' )
            );
        }

        return tags;
    }

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
    static buildContent(layerModel, feature, nonOsmTags) {
        let content = layerModel.get('popupContent');
        let data;

        if ( !content ) {
            return '';
        }

        if ( layerModel.get('type') === CONST.layerType.overpass) {
            data = feature.properties.tags;
        }
        else if ( feature.properties.tags ) {
            data = feature.properties.tags;
        }
        else {
            data = feature.properties;
        }

        content = content.replace(
            new RegExp('{id}', 'g'),
            feature.properties.id
        );

        content = content.replace(
            new RegExp('{type}', 'g'),
            feature.properties.type
        );

        for (const i in nonOsmTags) {
            if ({}.hasOwnProperty.call(nonOsmTags, i)) {
                const tag = nonOsmTags[i];

                content = content.replace(
                    new RegExp(`{${tag.key}}`, 'g'),
                    tag.value
                );
            }
        }

        for (const k in data) {
            if ({}.hasOwnProperty.call(data, k)) {
                content = content.replace(
                    new RegExp(`{${k}}`, 'g'),
                    data[k]
                );
            }
        }

        content = content.replace( /\{(.*?)\}/g, '' );

        return MarkedHelper.render(content);
    }
}
