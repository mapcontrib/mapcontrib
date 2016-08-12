
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MarkedHelper from '../helper/marked';
import template from '../../templates/infoGeoJsonLayerColumn.ejs';
import LeafletHelper from '../helper/leaflet';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {
            'appendToBody': true,
        },
    },

    ui: {
        'description': '.description_container',
        'downloadBtn': '.download_btn',
        'column': '#info_geojson_layer_column',
    },

    events: {
        'click @ui.downloadBtn': 'onClickDownload',
    },

    initialize(options) {
        this._radio = Wreqr.radio.channel('global');
    },

    templateHelpers() {
        return {
            'description': MarkedHelper.render( this.model.get('description') || '' ),
        };
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onRender() {
        if ( this.model.get('description') ) {
            this.ui.description.removeClass('hide');
        }
    },

    onClickDownload(e) {
        e.preventDefault();

        const markerCluster = this._radio.reqres.request('map:markerCluster', this.model);
        const layerName = this.model.get('name') || document.l10n.getSync('mapcontrib');
        const fileName = `${layerName}.geojson`;

        LeafletHelper.downloadGeoJsonFromLayer(markerCluster, fileName);
    },
});
