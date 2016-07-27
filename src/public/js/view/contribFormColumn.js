
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import ContributionErrorNotificationView from './contributionErrorNotification';
import template from '../../templates/contribFormColumn.ejs';
import osmAuth from 'osm-auth';
import OsmEditHelper from '../helper/osmEdit.js';
import LayerModel from '../model/layer';
import NonOsmDataModel from '../model/nonOsmData';
import OsmCacheModel from '../model/osmCache';
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
        'form': 'form',
        'content': '.content',
        'addBtn': '.add_btn',
        'footerButtons': '.sticky-footer button',
    },

    events: {
        'click @ui.addBtn': 'onClickAddBtn',
        'submit': 'onSubmit',
    },

    templateHelpers: function () {
        return {
            'fragment': this._theme.get('fragment'),
            'apiPath': `${CONST.apiPath}file/nonOsmData`,
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');
        this._theme = this._radio.reqres.request('theme');
        this._nonOsmData = this._radio.reqres.request('nonOsmData');
        this._osmCache = this._radio.reqres.request('osmCache');

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

        this.ui.footerButtons.prop('disabled', true);

        this._tagList.hideErrorFeedbacks();

        const hasFilesToUpload = this._tagList.hasFileToUpload();

        if ( hasFilesToUpload ) {
            this.ui.form.ajaxSubmit({
                'error': (xhr) => {
                    switch (xhr.status) {
                        case 413:
                            this._tagList.showErrorFeedback(xhr.responseJSON);
                            break;
                    }
                },
                'success': response => {
                    this._tagList.setFilesPathFromApiResponse(response);
                    this.saveLayer();
                }
            });
        }
        else {
            this.saveLayer();
        }
    },

    saveLayer: function () {
        const createdBy = CONST.osm.changesetCreatedBy
        .replace('{version}', MAPCONTRIB.version);
        const tags = this._tagList.getTags();
        const osmTags = {};
        const nonOsmTags = [];

        for (const tag of tags) {
            if (tag.nonOsmData) {
                nonOsmTags.push({
                    'key': tag.key,
                    'value': tag.value,
                    'type': tag.type,
                });
            }
            else {
                if (!tag.key || !tag.value) {
                    continue;
                }

                osmTags[tag.key] = tag.value;
            }
        }

        this._nonOsmDataModel = new NonOsmDataModel();
        this._nonOsmDataModel.updateModificationDate();
        this._nonOsmDataModel.set('osmType', 'node');
        this._nonOsmDataModel.set('userId', this.options.user.get('osmId'));
        this._nonOsmDataModel.set('themeFragment', this._theme.get('fragment'));
        this._nonOsmDataModel.set('tags', nonOsmTags);

        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setType('node');
        this._osmEdit.setVersion(0);
        this._osmEdit.setTimestamp();
        this._osmEdit.setLatitude(this._center.lat);
        this._osmEdit.setLongitude(this._center.lng);
        this._osmEdit.setTags(osmTags);
        this._osmEdit.setUid(this.options.user.get('osmId'));
        this._osmEdit.setDisplayName(this.options.user.get('displayName'));

        this.sendContributionToOSM();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then(osmId => {
            this.ui.footerButtons.prop('disabled', false);

            this._contributionSent = true;

            this._nonOsmDataModel.set('osmId', osmId);

            this._osmCacheModel = new OsmCacheModel();
            this._osmCacheModel.updateModificationDate();
            this._osmCacheModel.set('osmId', osmId);
            this._osmCacheModel.set('osmType', 'node');
            this._osmCacheModel.set('osmVersion', 0);
            this._osmCacheModel.set('osmElement', this._osmEdit.getElement());
            this._osmCacheModel.set('overPassElement', this._osmEdit.getOverPassElement());
            this._osmCacheModel.set('userId', this.options.user.get('osmId'));
            this._osmCacheModel.set('themeFragment', this._theme.get('fragment'));

            this._nonOsmData.add( this._nonOsmDataModel );
            this._osmCache.add( this._osmCacheModel );

            this._nonOsmDataModel.save();
            this._osmCacheModel.save();

            this.close();
        })
        .catch((err) => {
            this.ui.footerButtons.prop('disabled', false);

            new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            }).open();
        });
    },
});
