
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import MapUi from '../ui/map';
import CONST from '../const';
import template from '../../templates/newPoiPlacementContextual.ejs';
import LayerModel from '../model/layer';


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

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        return this.render();
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onOpen: function () {
        this._addCross();
    },

    _addCross: function () {
        let center = this._map.getCenter();

        let icon = L.divIcon({
            iconSize: [50, 50],
            iconAnchor: [25, 25],
            className: 'contribution_cross',
        });

        this._cross = L.marker(center, {
            icon: icon,
            clickable: false,
            zIndexOffset: 1000
        });

        this._map
        .on('move', this.onMapMove, this)
        .addLayer(this._cross);
    },

    _removeCross: function () {
        this._map.removeLayer(this._cross)
        .off('move', this.onMapMove, this);
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

        this._removeCross();

        this._map.addLayer(
            this._buildNewMarker( this.model )
        );

        let osmEdit = new OsmEditHelper(
            osmAuth({
                'oauth_consumer_key': config.oauthConsumerKey,
                'oauth_secret': config.oauthSecret,
                'oauth_token': this.options.user.get('token'),
                'oauth_token_secret': this.options.user.get('tokenSecret'),
            })
        );

        osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        osmEdit.setChangesetComment(CONST.osm.changesetComment);
        osmEdit.setType(this.model.get('type'));
        osmEdit.setVersion(this.model.get('version'));
        osmEdit.setTimestamp(this.model.get('timestamp'));
        osmEdit.setLatitude(this.model.get('lat'));
        osmEdit.setLongitude(this.model.get('lon'));
        osmEdit.setTags(this.model.get('tags'));
        osmEdit.setUid(this.options.user.get('osmId'));
        osmEdit.setDisplayName(this.options.user.get('displayName'));

        this.close();

        osmEdit.send()
        .then(nodeId => {
            let key = `node-${nodeId}`,
            contributions = JSON.parse( localStorage.getItem('osmEdit-contributions') ) || {};

            contributions[ key ] = this.model.attributes;

            localStorage.setItem( 'osmEdit-contributions', JSON.stringify( contributions ) );
        })
        .catch(err => {
            console.error(err);
        });
    },

    onClickBack: function () {
        this._removeCross();
        this.close();
        this.options.contribFormColumn.open();
    },
});
