
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/movePoiContextual.ejs';
import ContributionErrorNotificationView from './contributionErrorNotification';
import Cache from '../core/cache';


export default Marionette.ItemView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'contextual': {
            'destroyOnClose': true,
        },
    },

    ui: {
        'validateBtn': '.validate_btn',
        'cancelBtn': '.cancel_btn',
        'contextual': '.contextual',
    },

    events: {
        'click @ui.cancelBtn': 'onClickCancel',
        'click @ui.validateBtn': 'onClickValidate',
    },

    initialize: function (options) {
        const config = MAPCONTRIB.config;

        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        this._marker = options.marker;
        this._editPoiColumnView = options.editPoiColumnView;

        return this.render();
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onOpen: function () {
        this._marker.closePopup();
        MapUi.showContributionCross();

        this._map.panTo(
            this._marker.getLatLng(),
            { 'animate': true }
        );
    },

    onBeforeClose: function () {
        MapUi.hideContributionCross();
    },

    onClickCancel: function () {
        this.close();
        this._editPoiColumnView.open();
    },

    onClickValidate: function () {
        MapUi.hideContributionCross();

        let mapCenter = this._map.getCenter();

        this._editPoiColumnView.open();
        this._editPoiColumnView.setNewPosition(mapCenter.lat, mapCenter.lng);

        this.close();
    },
});
