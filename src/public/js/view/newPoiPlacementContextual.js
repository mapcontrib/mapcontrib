
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
        this._showCross();
    },

    _showCross: function () {
        $('body').addClass('contribution_cross_visible');
    },

    _hideCross: function () {
        $('body').removeClass('contribution_cross_visible');
    },

    onMapMove: function () {
        this._cross.setLatLng(
            this._map.getCenter()
        );
    },

    _buildNewMarker: function (model) {
        let pos = new L.LatLng(
            model.get('lat'),
            model.get('lon')
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

    onClickSave: function () {
        let mapCenter = this._map.getCenter();

        this.model.set('lat', mapCenter.lat);
        this.model.set('lon', mapCenter.lng);

        this._hideCross();

        this._map.addLayer(
            this._buildNewMarker( this.model )
        );

        this._osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setType(this.model.get('type'));
        this._osmEdit.setVersion(this.model.get('version'));
        this._osmEdit.setTimestamp(this.model.get('timestamp'));
        this._osmEdit.setLatitude(this.model.get('lat'));
        this._osmEdit.setLongitude(this.model.get('lon'));
        this._osmEdit.setTags(this.model.get('tags'));
        this._osmEdit.setUid(this.options.user.get('osmId'));
        this._osmEdit.setDisplayName(this.options.user.get('displayName'));

        this.sendContributionToOSM();

        this.close();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then((version) => {
            this.model.set('version', version);

            Cache.save(this.model.attributes);
        })
        .catch((err) => {
            let notification = new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            });

            notification.open();
        });
    },

    onClickBack: function () {
        this._hideCross();
        this.close();
        this.options.contribFormColumn.open();
    },
});
