
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import MapUi from '../ui/map';
import CONST from '../const';
import LayerModel from '../model/layer';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import template from '../../templates/contribFormColumn.ejs';


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

    initialize: function (options) {
        this._radio = Wreqr.radio.channel('global');
        this._user = options.user;
    },

    _buildNewMarker: function () {
        var pos = new L.LatLng(
            this.model.get('lat'),
            this.model.get('lon')
        ),
        icon = MapUi.buildLayerIcon(
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

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {
        this.triggerMethod('open');
    },

    onAfterOpen: function () {
        this._tempMarker = this._buildNewMarker();
        this._radio.reqres.request('map').addLayer(this._tempMarker);
    },

    close: function () {
        this.triggerMethod('close');
    },

    onBeforeClose: function () {
        if (this._tempMarker) {
            this._radio.reqres.request('map').removeLayer(this._tempMarker);
        }
    },

    onRender: function () {
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

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.model.set('tags', this._tagList.getTags());
        this.model.set('timestamp', new Date().toISOString());

        var map = this._radio.reqres.request('map'),
        osmEdit = new OsmEditHelper(
            osmAuth({
                'oauth_consumer_key': config.oauthConsumerKey,
                'oauth_secret': config.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
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
        osmEdit.setUid(this._user.get('osmId'));
        osmEdit.setDisplayName(this._user.get('displayName'));

        map.addLayer( this._buildNewMarker() );

        this.close();

        osmEdit.send()
        .then((nodeId) => {
            var key = 'node-'+ nodeId,
            contributions = JSON.parse( localStorage.getItem('osmEdit-contributions') ) || {};

            contributions[ key ] = this.model.attributes;

            localStorage.setItem( 'osmEdit-contributions', JSON.stringify( contributions ) );
        })
        .catch(function (err) {
            console.error(err);
        });
    },
});
