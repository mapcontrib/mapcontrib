
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

        if ( !content ) {
            return '';
        }

        content = MarkedHelper.render(content);

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

            content = content.replace(
                new RegExp(`{${k}}`, 'g'),
                localizedValue
            );
        }

        content = content.replace( /\{(.*?)\}/g, '' );

        return content;
    }
}
