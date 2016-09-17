
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import MarkedHelper from 'helper/marked';
import MapUi from 'ui/map';
import template from 'templates/select/layer/item.ejs';
import CONST from 'const';
import InfoOverPassLayerColumnView from 'view/infoOverPassLayerColumn';
import InfoGpxLayerColumnView from 'view/infoGpxLayerColumn';
import InfoCsvLayerColumnView from 'view/infoCsvLayerColumn';
import InfoGeoJsonLayerColumnView from 'view/infoGeoJsonLayerColumn';


export default Marionette.ItemView.extend({
    template,

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        href: '#',
    },

    modelEvents: {
        change: 'render',
    },

    ui: {
        visibilityCheckbox: '.visibility_checkbox',
        zoomTip: '.zoom_tip',
        infoLayerBtn: '.info_layer_btn',
    },

    events: {
        'click @ui.infoLayerBtn': 'onClickInfo', // Important : Has to be the first !
        'click a': 'onClickLink', // Important : Has to be the second !
        'click label': 'onClickLabel',
        click: 'onClick',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        const fragment = this._radio.reqres.request('theme:fragment');
        const storage = JSON.parse( localStorage.getItem(`mapState-${fragment}`) );


        this._fragment = fragment;

        if ( storage && storage.hiddenLayers && storage.hiddenLayers.indexOf(this.model.get('uuid')) > -1 ) {
            this._layerIsVisible = false;
        }
        else {
            this._layerIsVisible = true;
        }

        this._radio.vent.on('map:zoomChanged', this.render, this);
    },

    templateHelpers() {
        return {
            description: MarkedHelper.render( this.model.get('description') || '' ),
            marker: MapUi.buildLayerHtmlIcon( this.model ),
        };
    },

    onDestroy() {
        this._radio.vent.off('map:zoomChanged', this.render);
    },

    onRender() {
        const currentZoom = this._radio.reqres.request('map:currentZoom');
        const n = (this.model.get('minZoom') - currentZoom) || 0;

        if ( n > 0 && !this.model.get('cache') && !this.model.get('fileUri') ) {
            this.ui.zoomTip
            .html( document.l10n.getSync('selectLayerColumn_needToZoom', { n }) )
            .removeClass('hide');
        }
        else {
            this.ui.zoomTip
            .addClass('hide')
            .empty();
        }

        this.ui.visibilityCheckbox.prop('checked', this._layerIsVisible);
    },

    onClick(e) {
        e.stopPropagation();

        const key = `mapState-${this._fragment}`;
        const oldState = JSON.parse( localStorage.getItem( key ) ) || {};
        let hiddenLayers = oldState.hiddenLayers || [];

        this.ui.visibilityCheckbox.prop('checked', this._layerIsVisible);

        if ( this._layerIsVisible ) {
            this._radio.commands.execute( 'map:showLayer', this.model );

            hiddenLayers = _.without( hiddenLayers, this.model.get('uuid') );
        }
        else {
            this._radio.commands.execute( 'map:hideLayer', this.model );

            hiddenLayers = _.union( hiddenLayers, [this.model.get('uuid')] );
        }

        const newState = {
            ...oldState,
            ...{ hiddenLayers },
        };

        localStorage.setItem( key, JSON.stringify( newState ) );
    },

    onClickLabel(e) {
        e.preventDefault();
    },

    onClickLink(e) {
        e.stopPropagation();
    },

    onClickInfo(e) {
        e.preventDefault();
        e.stopPropagation();

        switch (this.model.get('type')) {
            case CONST.layerType.overpass:
                new InfoOverPassLayerColumnView({
                    model: this.model,
                }).open();
                break;
            case CONST.layerType.gpx:
                new InfoGpxLayerColumnView({
                    model: this.model,
                }).open();
                break;
            case CONST.layerType.csv:
                new InfoCsvLayerColumnView({
                    model: this.model,
                }).open();
                break;
            case CONST.layerType.geojson:
                new InfoGeoJsonLayerColumnView({
                    model: this.model,
                }).open();
                break;
            default:
        }
    },
});
