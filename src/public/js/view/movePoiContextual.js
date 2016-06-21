
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/movePoiContextual.ejs';
import OsmNodeModel from '../model/osmNode';
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
        'cancelBtn': '.cancel_btn',
        'contextual': '.contextual',
    },

    events: {
        'click @ui.cancelBtn': 'onClickCancel',
        'click @ui.saveBtn': 'onClickSave',
    },

    initialize: function (options) {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        this._user = options.user;
        this._marker = options.marker;
        this._osmElement = options.osmElement;
        this._layerModel = options.layerModel;

        this.model = new OsmNodeModel({
            'id': this._osmElement.id,
            'type': this._osmElement.type,
            'version': this._osmElement.version,
            'lat': this._osmElement.lat,
            'lon': this._osmElement.lon,
            'tags': this._osmElement.tags,
        });

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
        this._marker.closePopup();
        MapUi.showContributionCross();

        this._map.panTo(
            this._marker.getLatLng(),
            { 'animate': false }
        );
    },

    onBeforeClose: function () {
        MapUi.hideContributionCross();
    },

    onClickCancel: function () {
        this.close();
    },

    onClickSave: function () {
        MapUi.hideContributionCross();

        let mapCenter = this._map.getCenter();

        this.model.set('lat', mapCenter.lat);
        this.model.set('lon', mapCenter.lng);

        this._marker.setLatLng(
            L.latLng( mapCenter )
        );

        this._osmEdit.setId(this.model.get('id'));
        this._osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setType(this.model.get('type'));
        this._osmEdit.setVersion(this.model.get('version'));
        this._osmEdit.setTimestamp(this.model.get('timestamp'));
        this._osmEdit.setLatitude(this.model.get('lat'));
        this._osmEdit.setLongitude(this.model.get('lon'));
        this._osmEdit.setTags(this.model.get('tags'));
        this._osmEdit.setUid(this._user.get('osmId'));
        this._osmEdit.setDisplayName(this._user.get('displayName'));

        this.sendContributionToOSM();

        this.close();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then((version) => {
            this.model.set('version', version);

            this._radio.commands.execute(
                'map:updatePoiPopup',
                this._layerModel,
                this.model.toJSON()
            );

            Cache.save(this.model.attributes);
        })
        .catch((err) => {
            let notification = new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            });

            notification.open();
        });
    },
});
