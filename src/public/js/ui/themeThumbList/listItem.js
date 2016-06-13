
import Marionette from 'backbone.marionette';
import MapUi from '../map';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    className: 'col-xs-12 col-sm-4 col-lg-3 append-xs-1',

    ui: {
        'rootElement': '.ui-theme-thumb-theme',
        'markersContainer': '.ui-theme-thumb-markers',
    },

    events: {
        'click @ui.rootElement': 'onClickRootElement',
    },

    onRender: function () {
        let layers = this.model.get('layers');

        if (layers) {
            let i = 0;

            for (let layer of layers.models) {
                let markerElement = document.createElement('div');
                markerElement.innerHTML = MapUi.buildLayerHtmlIcon( layer );
                markerElement.classList.add(`ui-theme-thumb-marker-${i}`);

                this.ui.markersContainer.append(markerElement);

                i++;

                if (i === 3) {
                    break;
                }
            }
        }
    },

    onClickRootElement: function (e) {
        window.location.replace(
            this.model.buildPath()
        );
    }
});
