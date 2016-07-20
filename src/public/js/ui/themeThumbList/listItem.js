
import Marionette from 'backbone.marionette';
import MapUi from '../map';
import GeoUtils from '../../core/geoUtils';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    className: 'col-xs-12 col-sm-4 col-lg-3 append-xs-1',

    ui: {
        'layersContainer': '.ui-theme-thumb-layers',
    },

    templateHelpers: function () {
        const zoomLevel = this.model.get('zoomLevel');
        const mapCenter = this.model.get('center');
        const pos = GeoUtils.zoomLatLngToXY(
            zoomLevel,
            mapCenter.lat,
            mapCenter.lng
        );

        return {
            'href': this.model.buildPath(),
            'z': zoomLevel,
            'x1': pos[0],
            'y1': pos[1],
            'x2': pos[0] + 1,
            'y2': pos[1],
            'x3': pos[0] + 2,
            'y3': pos[1],
        };
    },

    onRender: function () {
        let layers = this.model.get('layers');

        if (layers) {
            let i = 0;

            for (let layer of layers.models) {
                let iconElement = document.createElement('div');
                iconElement.innerHTML = MapUi.buildLayerHtmlIcon( layer );
                iconElement.classList.add(`ui-theme-thumb-layer-${i}`);

                this.ui.layersContainer.append(iconElement);

                i++;

                if (i === 3) {
                    break;
                }
            }
        }
    },
});
