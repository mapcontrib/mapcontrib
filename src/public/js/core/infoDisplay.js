
import MarkedHelper from '../helper/marked';
import CONST from '../const';

export default class InfoDisplay {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} layerModel - Element's layer.
     * @param {object} feature - Element's geoJson representation.
     * @param {boolean} feature - Is the user logged?
     * @returns {string}
     */
    static buildContent (layerModel, feature, isLogged) {
        const dataEditable = layerModel.get('dataEditable');
        let content = layerModel.get('popupContent');
        let data;

        if ( !content ) {
            return '';
        }

        if ( layerModel.get('type') === CONST.layerType.overpass) {
            data = feature.properties.tags;
        }
        else {
            if ( feature.properties.tags ) {
                data = feature.properties.tags;
            }
            else {
                data = feature.properties;
            }
        }

        for (var k in data) {
            content = content.replace(
                new RegExp('{'+ k +'}', 'g'),
                data[k]
            );
        }

        content = content.replace( /\{(.*?)\}/g, '' );

        return MarkedHelper.render(content);
    }
}
