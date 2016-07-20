
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import ContributionErrorNotificationView from './contributionErrorNotification';
import template from '../../templates/contribFormColumn.ejs';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import LayerModel from '../model/layer';
import CONST from '../const';
import MapUi from '../ui/map';
import L from 'leaflet';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'tagList': '.rg_tag_list',
    },

    ui: {
        'column': '#contrib_form_column',
        'content': '.content',
        'addBtn': '.add_btn',
    },

    events: {
        'click @ui.addBtn': 'onClickAddBtn',
        'submit': 'onSubmit',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');

        this._user = this.options.user;
        this._center = this.options.center;

        this._osmEdit = new OsmEditHelper(
            osmAuth({
                'oauth_consumer_key': MAPCONTRIB.config.oauthConsumerKey,
                'oauth_secret': MAPCONTRIB.config.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
            })
        );
    },

    _buildNewMarker: function (latLng) {
        const pos = new L.LatLng(
            latLng.lat,
            latLng.lng
        );

        const icon = MapUi.buildLayerIcon(
            L,
            new LayerModel({
                'markerShape': MAPCONTRIB.config.newPoiMarkerShape,
                'markerIconType': CONST.map.markerIconType.library,
                'markerIcon': MAPCONTRIB.config.newPoiMarkerIcon,
                'markerColor': MAPCONTRIB.config.newPoiMarkerColor
            })
        );

        return L.marker(pos, { icon });
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    onBeforeClose: function () {
        if (!this._contributionSent) {
            this._map.removeLayer( this._layer );
        }
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onRender: function () {
        this._layer = this._buildNewMarker( this._center );
        this._map.addLayer( this._layer );

        this._tagList = new ContribNodeTagsListView();

        if (this.options.presetModel) {
            this._tagList.setTags(this.options.presetModel.get('tags'));
        }
        else {
            this._tagList.setTags([]);
        }

        this.getRegion('tagList').show( this._tagList );
    },

    onClickAddBtn: function () {
        this._tagList.addTag();

        const scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    onSubmit: function (e) {
        e.preventDefault();

        const createdBy = CONST.osm.changesetCreatedBy
        .replace('{version}', MAPCONTRIB.version);

        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setType('node');
        this._osmEdit.setVersion(0);
        this._osmEdit.setTimestamp();
        this._osmEdit.setLatitude(this._center.lat);
        this._osmEdit.setLongitude(this._center.lng);
        this._osmEdit.setTags(this._tagList.getTags());
        this._osmEdit.setUid(this.options.user.get('osmId'));
        this._osmEdit.setDisplayName(this.options.user.get('displayName'));

        this.sendContributionToOSM();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then(version => {
            this._contributionSent = true;

            this._osmEdit.setVersion(version);

            this.close();
        })
        .catch((err) => {
            new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            }).open();
        });
    },
});
