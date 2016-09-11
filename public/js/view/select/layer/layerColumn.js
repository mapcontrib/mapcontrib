
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SelectLayerListView from './list';
import template from 'templates/select/layer/layerColumn.ejs';
import LeafletHelper from 'helper/leaflet';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors() {
        return {
            'l20n': {},
            'column': {
                'appendToBody': true,
                'destroyOnClose': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    regions: {
        'layerList': '.rg_list',
    },

    ui: {
        'column': '.column',
        'downloadBtn': '.download_btn',
    },

    events: {
        'click @ui.downloadBtn': 'onClickDownload',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._radio.commands.setHandler('column:selectLayer:render', this.render.bind(this));
    },

    onRender() {
        this.getRegion('layerList').show(
            new SelectLayerListView({ 'collection': this.collection })
        );
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

    onClickDownload(e) {
        const map = this._radio.reqres.request('map');
        const theme = this._radio.reqres.request('theme');
        const themeName = theme.get('name') || document.l10n.getSync('mapcontrib');
        const fileName = `${themeName}.geojson`;

        LeafletHelper.downloadGeoJsonFromBbox(map, fileName);
    },
});
