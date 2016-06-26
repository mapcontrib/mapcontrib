
import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/newPoiPlacementContextual.ejs';
import LayerModel from '../model/layer';
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
        'saveBtn': '.save_btn',
        'backBtn': '.back_btn',
        'contextual': '.contextual',
    },

    events: {
        'click @ui.backBtn': 'onClickBack',
        'click @ui.saveBtn': 'onClickSave',
    },

    initialize: function (options) {
        const config = MAPCONTRIB.config;

        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');
        this._user = options.user;

        this._osmEdit = new OsmEditHelper(
            osmAuth({
                'oauth_consumer_key': config.oauthConsumerKey,
                'oauth_secret': config.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
            })
        );

        return this.render();
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onOpen: function () {
        MapUi.showContributionCross();
    },

    onBeforeClose: function () {
        MapUi.hideContributionCross();
    },

    onMapMove: function () {
        this._cross.setLatLng(
            this._map.getCenter()
        );
    },

    _buildNewMarker: function (latLng) {
        const config = MAPCONTRIB.config;

        let pos = new L.LatLng(
            latLng.lat,
            latLng.lng
        );

        let icon = MapUi.buildLayerIcon(
            L,
            new LayerModel({
                'markerShape': config.newPoiMarkerShape,
                'markerIconType': CONST.map.markerIconType.library,
                'markerIcon': config.newPoiMarkerIcon,
                'markerColor': config.newPoiMarkerColor
            })
        );

        return L.marker(pos, {
            'icon': icon
        });
    },

    onClickBack: function () {
        MapUi.hideContributionCross();
        this.close();
        this.options.contribFormColumn.open();
    },

    onClickSave: function () {
        MapUi.hideContributionCross();

        let mapCenter = this._map.getCenter();

        this._map.addLayer(
            this._buildNewMarker( mapCenter )
        );

        const createdBy = CONST.osm.changesetCreatedBy
        .replace('{version}', MAPCONTRIB.version);

        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setType('node');
        this._osmEdit.setVersion(0);
        this._osmEdit.setTimestamp();
        this._osmEdit.setLatitude(mapCenter.lat);
        this._osmEdit.setLongitude(mapCenter.lng);
        this._osmEdit.setTags(this.options.tags);
        this._osmEdit.setUid(this.options.user.get('osmId'));
        this._osmEdit.setDisplayName(this.options.user.get('displayName'));

        this.sendContributionToOSM();

        this.close();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then(version => {
            this._osmEdit.setVersion(version);
        })
        .catch((err) => {
            let notification = new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            });

            notification.open();
        });
    },
});
