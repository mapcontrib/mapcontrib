
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from '../const';
import L from 'leaflet';
import osmtogeojson from 'osmtogeojson';
import OverPassLayer from 'leaflet-overpass-layer';
import MarkerCluster from 'leaflet.markercluster';
import Omnivore from 'leaflet-omnivore';
import fullScreenPolyfill from 'fullscreen-api-polyfill';

import ThemeTitleView from './themeTitle';
import InfoDisplayModalView from './infoDisplayModal';
import InfoDisplayColumnView from './infoDisplayColumn';
import GeocodeWidgetView from './geocodeWidget';
import SelectLayerColumnView from './selectLayerColumn';
import SelectTileColumnView from './selectTileColumn';
import UserColumnView from './userColumn';
import VisitorColumnView from './visitorColumn';
import LinkColumnView from './linkColumn';
import ContribColumnView from './contribColumn';
import ContribFormColumnView from './contribFormColumn';
import EditSettingColumnView from './editSettingColumn';
import EditLayerListColumnView from './editLayerListColumn';
import AddLayerMenuColumnView from './addLayerMenuColumn';
import EditOverPassLayerFormColumnView from './editOverPassLayerFormColumn';
import EditGpxLayerFormColumnView from './editGpxLayerFormColumn';
import EditCsvLayerFormColumnView from './editCsvLayerFormColumn';
import EditGeoJsonLayerFormColumnView from './editGeoJsonLayerFormColumn';
import EditLayerMarkerModalView from './editLayerMarkerModal';
import EditTileColumnView from './editTileColumn';
import EditPresetColumnView from './editPresetColumn';
import EditPresetTagsColumnView from './editPresetTagsColumn';
import EditPoiColumnView from './editPoiColumn';
import ZoomNotificationView from './zoomNotification';
import OverPassTimeoutNotificationView from './overPassTimeoutNotification';
import OverPassErrorNotificationView from './overPassErrorNotification';
import CsvErrorNotificationView from './csvErrorNotification';
import GeoJsonErrorNotificationView from './geoJsonErrorNotification';
import GpxErrorNotificationView from './gpxErrorNotification';
import NewPoiPlacementContextual from './newPoiPlacementContextual';


import LayerModel from '../model/layer';
import PresetModel from '../model/preset';

import MapUi from '../ui/map';
import Geolocation from '../core/geolocation';
import Cache from '../core/cache';
import OsmData from '../core/osmData';
import InfoDisplay from '../core/infoDisplay';
import OverPassHelper from '../helper/overPass';
import GeoJsonHelper from '../helper/geoJson';
import MarkedHelper from '../helper/marked';

import template from '../../templates/themeRoot.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
    },

    ui: {
        'map': '#main_map',
        'toolbarButtons': '.toolbar .toolbar_btn',


        'leftToolbar': '#left_toolbar',
        'controlToolbar': '#control_toolbar',
        'zoomInButton': '#control_toolbar .zoom_in_btn',
        'zoomOutButton': '#control_toolbar .zoom_out_btn',
        'toolbarZoomLevel': '#control_toolbar .zoom_level',
        'geocodeButton': '#control_toolbar .geocode_btn',
        'geocodeIcon': '#control_toolbar .geocode_btn i',
        'geocodeSpinner': '#control_toolbar .geocode_btn .spinner',
        'locateButton': '#control_toolbar .locate_btn',
        'locateWaitButton': '#control_toolbar .locate_wait_btn',
        'expandScreenButton': '#control_toolbar .expand_screen_btn',
        'compressScreenButton': '#control_toolbar .compress_screen_btn',
        'controlLayerButton': '#control_toolbar .layer_btn',
        'controlLayerIcon': '#control_toolbar .layer_btn i',
        'controlLayerSpinner': '#control_toolbar .layer_btn .spinner',
        'controlTileButton': '#control_toolbar .tile_btn',

        'rightToolbar': '#right_toolbar',
        'userToolbar': '#user_toolbar',
        'userButton': '#user_toolbar .user_btn',
        'linkButton': '#user_toolbar .link_btn',
        'tempLayerButton': '#user_toolbar .temp_layer_btn',
        'contribButton': '#user_toolbar .contrib_btn',

        'helpToolbar': '#help_toolbar',
        'helpButton': '#help_toolbar .help_btn',
        'help': '#help',
        'helpCloseButton': '#help .close_btn',

        'editToolbar': '#edit_toolbar',
        'editSettingButton': '#edit_toolbar .setting_btn',
        'editLayerButton': '#edit_toolbar .layer_btn',
        'editTileButton': '#edit_toolbar .tile_btn',
        'editPresetButton': '#edit_toolbar .preset_btn',

        'helpTextVersion': '#helpTextVersion',
    },

    regions: {
        'mainTitle': '#rg_main_title',

        'geocodeWidget': '#rg_geocode_widget',

        'selectLayerColumn': '#rg_select_layer_column',
        'selectTileColumn': '#rg_select_tile_column',
        'userColumn': '#rg_user_column',
        'visitorColumn': '#rg_visitor_column',
        'linkColumn': '#rg_link_column',
        'contribColumn': '#rg_contrib_column',
        'contribFormColumn': '#rg_contrib_form_column',
        'editSettingColumn': '#rg_edit_setting_column',
        'editLayerListColumn': '#rg_edit_layer_column',
        'addLayerMenuColumn': '#rg_add_layer_menu_column',
        'editLayerFormColumn': '#rg_edit_poi_layer_column',
        'editLayerMarkerModal': '#rg_edit_poi_marker_modal',
        'editTileColumn': '#rg_edit_tile_column',
        'editPresetColumn': '#rg_edit_preset_column',
        'editPresetTagsColumn': '#rg_edit_preset_tags_column',
        'editPoiColumn': '#rg_edit_poi_column',

        'zoomNotification': '#rg_zoom_notification',
    },

    events: {
        'click @ui.zoomInButton': 'onClickZoomIn',
        'click @ui.zoomOutButton': 'onClickZoomOut',
        'click @ui.geocodeButton': 'onClickGeocode',
        'click @ui.locateButton': 'onClickLocate',
        'click @ui.locateWaitButton': 'onClickLocateWait',
        'click @ui.expandScreenButton': 'onClickExpandScreen',
        'click @ui.compressScreenButton': 'onClickCompressScreen',
        'click @ui.controlLayerButton': 'onClickSelectLayer',
        'click @ui.controlTileButton': 'onClickSelectTile',

        'click @ui.helpButton': 'onClickHelp',
        'click @ui.helpCloseButton': 'onClickHelpClose',

        'click @ui.userButton': 'onClickUser',
        'click @ui.linkButton': 'onClickLink',
        'click @ui.contribButton': 'onClickContrib',
        'click @ui.editSettingButton': 'onClickEditSetting',
        'click @ui.editLayerButton': 'onClickEditLayer',
        'click @ui.editTileButton': 'onClickEditTile',
        'click @ui.editPresetButton': 'onClickEditPreset',

        'keydown': 'onKeyDown',
    },

    initialize: function (options) {
        this._app = options.app;
        this._user = this._app.getUser();
        this._config = this._app.getConfig();
        this._version = this._app.getVersion();

        this.model = this._app.getTheme();

        this._layerCollection = this.model.get('layers');
        this._presetCollection = this.model.get('presets');

        this._window = this._app.getWindow();
        this._document = this._app.getDocument();

        this._seenZoomNotification = false;
        this._minDataZoom = 0;
        this._poiLoadingSpool = [];

        this._osmData = new OsmData();
        this._markerClusters = {};
        this._overPassLayers = {};

        this._radio = Wreqr.radio.channel('global');


        this._radio.reqres.setHandlers({
            'user:isOwner': () => {
                return this.model.isOwner( this._user );
            },
            'theme:fragment': () => {
                return this.model.get('fragment');
            },
            'map:currentZoom': (tileId) => {
                if (this._map) {
                    return this._map.getZoom();
                }
            },
            'map:markerCluster': (layerModel) => {
                return this._markerClusters[ layerModel.cid ];
            },
        });

        this._radio.commands.setHandlers({
            'theme:save': () => {
                this.model.updateModificationDate();
                this.model.save();
            },
            'column:showAddLayerMenu': () => {
                this.onCommandShowAddLayerMenu();
            },
            'column:editOverPassLayer': (layerModel) => {
                this.onCommandEditOverPassLayer( layerModel );
            },
            'column:editGpxLayer': (layerModel) => {
                this.onCommandEditGpxLayer( layerModel );
            },
            'column:editCsvLayer': (layerModel) => {
                this.onCommandEditCsvLayer( layerModel );
            },
            'column:editGeoJsonLayer': (layerModel) => {
                this.onCommandEditGeoJsonLayer( layerModel );
            },
            'column:showContribColumn': (options) => {
                this.onCommandShowContribColumn( options );
            },
            'column:showContribForm': (options) => {
                this.onCommandShowContribForm( options );
            },
            'column:showPresetTags': (presetModel) => {
                this.onCommandShowPresetTags( presetModel );
            },
            'modal:showEditPoiMarker': (layerModel) => {
                this.onCommandShowEditPoiMarker( layerModel );
            },
            'map:setTileLayer': (tileId) => {
                this.setTileLayer( tileId );
            },
            'map:addLayer': (layerModel) => {
                this.addLayer( layerModel );
            },
            'map:removeLayer': (layerModel) => {
                this.removeLayer( layerModel );
            },
            'map:showLayer': (layerModel) => {
                this.showLayer( layerModel );
            },
            'map:hideLayer': (layerModel) => {
                this.hideLayer( layerModel );
            },
            'map:updateLayerStyles': (layerModel) => {
                this.updateLayerStyles( layerModel );
            },
            'map:updateLayerPopups': (layerModel) => {
                this.updateLayerPopups( layerModel );
            },
            'map:updateLayerMinZoom': (layerModel) => {
                this.updateLayerMinZoom( layerModel );
            },
            'map:updatePoiPopup': (layerModel, node) => {
                this.updatePoiPopup( layerModel, node );
            },
            'map:setPosition': (latLng, zoomLevel) => {
                this.setPosition( latLng, zoomLevel );
            },
            'map:fitBounds': (latLngBounds) => {
                this.fitBounds( latLngBounds );
            },
            'map:unbindAllPopups': () => {
                this.unbindAllPopups();
            },
            'map:bindAllPopups': () => {
                this.bindAllPopups();
            },
            'saveOsmData': (osmElement) => {
                this._osmData.save(osmElement);
            },
        });

        this._radio.vent.on('session:unlogged', () => {
            this.renderUserButton();
            this.hideContribButton();
            this.hideEditTools();
            this.updateAllLayerPopups();
        });

    },

    onRender: function () {
        this.renderUserButton();

        if ( this._app.isLogged() ) {
            this.showContribButton();

            if ( this.model.isOwner(this._user) === true ) {
                this.showEditTools();
            }
        }
        else {
            this.hideContribButton();
            this.hideEditTools();
        }


        this._geocodeWidgetView = new GeocodeWidgetView({
            'model': this.model,
            'icon': this.ui.geocodeIcon,
            'spinner': this.ui.geocodeSpinner,
        });
        this._selectLayerColumnView = new SelectLayerColumnView({ 'collection': this._layerCollection });
        this._selectTileColumnView = new SelectTileColumnView({ 'model': this.model });
        this._userColumnView = new UserColumnView();
        this._visitorColumnView = new VisitorColumnView({ 'theme': this.model });
        this._linkColumnView = new LinkColumnView({ 'model': this.model });
        this._contribColumnView = new ContribColumnView({ 'theme': this.model });
        this._editSettingColumnView = new EditSettingColumnView({ 'model': this.model });
        this._editLayerListColumnView = new EditLayerListColumnView({ 'model': this.model });
        this._addLayerMenuColumnView = new AddLayerMenuColumnView({ 'model': this.model });
        this._editTileColumnView = new EditTileColumnView({ 'model': this.model });
        this._editPresetColumnView = new EditPresetColumnView({ 'model': this.model });

        this._zoomNotificationView = new ZoomNotificationView();


        this.getRegion('mainTitle').show( new ThemeTitleView({ 'model': this.model }) );

        this.getRegion('geocodeWidget').show( this._geocodeWidgetView );
        this.getRegion('selectLayerColumn').show( this._selectLayerColumnView );
        this.getRegion('selectTileColumn').show( this._selectTileColumnView );
        this.getRegion('userColumn').show( this._userColumnView );
        this.getRegion('visitorColumn').show( this._visitorColumnView );
        this.getRegion('linkColumn').show( this._linkColumnView );
        this.getRegion('contribColumn').show( this._contribColumnView );
        this.getRegion('editSettingColumn').show( this._editSettingColumnView );
        this.getRegion('editLayerListColumn').show( this._editLayerListColumnView );
        this.getRegion('addLayerMenuColumn').show( this._addLayerMenuColumnView );
        this.getRegion('editTileColumn').show( this._editTileColumnView );
        this.getRegion('editPresetColumn').show( this._editPresetColumnView );

        this.getRegion('zoomNotification').show( this._zoomNotificationView );


        if ( !this._document.fullscreenEnabled) {
            this.ui.expandScreenButton.addClass('hide');
            this.ui.compressScreenButton.addClass('hide');
        }

        if ( !File || !FileList || !FileReader) {
            this.ui.tempLayerButton.addClass('hide');
        }

        $(this._window).on('fullscreenchange', () => {
            if ( this._document.fullscreenElement ) {
                this.onExpandScreen();
            }
            else {
                this.onCompressScreen();
            }
        });

        this.ui.helpTextVersion.html(
            this._document.l10n.getSync(
                'helpTextVersion',
                { 'version': this._version }
            )
        );
    },

    onShow: function () {
        let center = this.model.get('center'),
        autoCenter = this.model.get('autoCenter'),
        zoomLevel = this.model.get('zoomLevel'),
        hiddenLayers = [],
        storageMapState = localStorage.getItem('mapState-'+ this.model.get('fragment'));

        if ( storageMapState ) {
            storageMapState = JSON.parse( storageMapState );
            center = storageMapState.center;
            zoomLevel = storageMapState.zoomLevel;
            hiddenLayers = storageMapState.hiddenLayers || [];
        }

        this.ui.toolbarButtons.tooltip({
            'container': 'body',
            'delay': {
                'show': CONST.tooltip.showDelay,
                'hide': CONST.tooltip.hideDelay
            }
        })
        .on('click', function () {
            $(this)
            .blur()
            .tooltip('hide');
        });


        this._map = L.map(this.ui.map[0], { 'zoomControl': false });

        this.ui.map.focus();

        this._radio.reqres.removeHandler('map');
        this._radio.reqres.setHandler('map', () => {
            return this._map;
        });

        this._map
        .setView([center.lat, center.lng], zoomLevel)
        .on('popupopen', (e) => {
            this.onPopupOpen(e);
        })
        .on('popupclose', (e) => {
            this.onPopupClose(e);
        })
        .on('moveend', (e) => {
            this.onMoveEnd();
        })
        .on('zoomend', (e) => {
            this.onZoomEnd(e);
            this._radio.vent.trigger('map:zoomChanged');
        })
        .on('zoomlevelschange', (e) => {
            this.onZoomLevelsChange(e);
            this._radio.vent.trigger('map:zoomChanged');
        })
        .on('locationfound', () => {
            this.onLocationFound();
        })
        .on('locationerror', () => {
            this.onLocationError();
        });


        if ( storageMapState ) {
            this.setTileLayer(storageMapState.selectedTile);
        }
        else {
            this.setTileLayer();
        }

        L.control.scale({
            'position': 'bottomright',
        }).addTo(this._map);


        _.each(this._layerCollection.getVisibleLayers(), (layerModel) => {
            if ( hiddenLayers.indexOf(layerModel.get('uniqid')) === -1 ) {
                this.addLayer( layerModel );
            }
            else {
                this.addLayer( layerModel, true );
            }
        }, this);


        this.updateMinDataZoom();

        this._layerCollection.on('destroy', (model) => {
            this.removeLayer(model);
        }, this);


        this._geolocation = new Geolocation(this._map);

        if ( autoCenter ) {
            this.onClickLocate();
        }
    },

    setTileLayer: function (id) {
        var tile,
        tileLayersGroup = L.layerGroup(),
        tiles = this.model.get('tiles');

        if ( tiles.length === 0 ) {
            tiles = ['osm'];
        }

        if ( !id ) {
            id = tiles[0];
        }

        if ( !this._currentTileId ) {
            this._currentTileId = tiles[0];
        }
        else if ( this._currentTileId === id ) {
            return;
        }

        tile = CONST.map.tiles[id];

        if (!tile) {
            return;
        }

        for (let urlTemplate of tile.urlTemplate) {
            tileLayersGroup.addLayer(
                L.tileLayer(urlTemplate, {
                    'attribution': tile.attribution,
                    'minZoom': tile.minZoom,
                    'maxZoom': tile.maxZoom,
                })
            );
        }

        this._map.addLayer(tileLayersGroup);

        if ( this._currentTileLayer ) {
            this._map.removeLayer( this._currentTileLayer );
        }

        this._currentTileId = id;
        this._currentTileLayer = tileLayersGroup;

        this.updateMinDataZoom();
    },

    showLayerLoadingProgress: function (layerModel) {
        if ( !this._poiLoadingSpool[ layerModel.cid ] ) {
            this._poiLoadingSpool[ layerModel.cid ] = 0;
        }

        this._poiLoadingSpool[ layerModel.cid ] += 1;

        this.ui.controlLayerIcon.addClass('hide');
        this.ui.controlLayerSpinner.removeClass('hide');
    },

    hideLayerLoadingProgress: function (layerModel) {
        if ( !this._poiLoadingSpool[ layerModel.cid ] ) {
            return;
        }

        this._poiLoadingSpool[ layerModel.cid ] -= 1;

        var countRequests = 0;

        for (var cid in this._poiLoadingSpool) {
            countRequests += this._poiLoadingSpool[cid];
        }

        if ( countRequests === 0) {
            this.ui.controlLayerSpinner.addClass('hide');
            this.ui.controlLayerIcon.removeClass('hide');
        }
    },

    addLayer: function (layerModel, hidden) {
        switch (layerModel.get('type')) {
            case CONST.layerType.overpass:
                this.addOverPassLayer(layerModel, hidden);
                break;
            case CONST.layerType.gpx:
                this.addGpxLayer(layerModel, hidden);
                break;
            case CONST.layerType.csv:
                this.addCsvLayer(layerModel, hidden);
                break;
            case CONST.layerType.geojson:
                this.addGeoJsonLayer(layerModel, hidden);
                break;
        }
    },

    addOverPassLayer: function (layerModel, hiddenLayer) {
        const cache = layerModel.get('cache');
        const cacheFilePath = layerModel.get('fileUri');

        if (cache && cacheFilePath) {
            return this.addOverPassCacheLayer(layerModel, hiddenLayer);
        }

        const markerCluster = this._buildMarkerCluster(layerModel);
        this._markerClusters[ layerModel.cid ] = markerCluster;
        this._map.addLayer( markerCluster );

        const overPassRequest = OverPassHelper.buildRequestForTheme(
            layerModel.get('overpassRequest') || ''
        );

        const overPassLayer = new OverPassLayer({
            'debug': this._config.debug,
            'endPoint': this._config.overPassEndPoint,
            'minZoom': layerModel.get('minZoom'),
            'timeout': this._config.overPassTimeout,
            'retryOnTimeout': true,
            'query': overPassRequest,
            'beforeRequest': () => {
                this.showLayerLoadingProgress( layerModel );
            },
            'afterRequest': () => {
                this.hideLayerLoadingProgress( layerModel );
            },
            'onSuccess': (data) => {
                let i = 1;
                let objects = {};
                let elements = [];

                for (let i in data.elements) {
                    let e = data.elements[i];

                    if ( this._osmData.exists(e.type, e.id) ) {
                        continue;
                    }

                    elements.push(e);
                    this._osmData.save(e);
                }

                data.elements = elements;

                L.geoJson(
                    osmtogeojson(data),
                    {
                        onEachFeature: function (feature, layer) {
                            objects[i] = layer;
                            i++;
                        }
                    }
                );

                this._customizeDataAndDisplay(
                    objects,
                    markerCluster,
                    layerModel,
                    CONST.layerType.overpass,
                    hiddenLayer
                );
            },

            onTimeout: function (xhr) {
                new OverPassTimeoutNotificationView({
                    'model': layerModel
                }).open();
            },

            onError: function (xhr) {
                new OverPassErrorNotificationView({
                    'model': layerModel,
                    'error': xhr.statusText,
                }).open();
            },
        });

        this._overPassLayers[ layerModel.cid ] = overPassLayer;

        if (!hiddenLayer) {
            this._map.addLayer( overPassLayer );
        }
    },

    addGpxLayer: function (layerModel, hiddenLayer) {
        let omnivore = Omnivore.gpx(
            layerModel.get('fileUri')
        )
        .on('error', function(error) {
            new GpxErrorNotificationView({
                'model': layerModel,
                'error': error.error[0].message,
            }).open();
        })
        .on('ready', layer => {
            let markerCluster = this._buildMarkerCluster(layerModel);

            this._customizeDataAndDisplay(
                layer.target._layers,
                markerCluster,
                layerModel,
                CONST.layerType.gpx,
                hiddenLayer
            );
        });
    },

    addCsvLayer: function (layerModel, hiddenLayer) {
        let omnivore = Omnivore.csv(
            layerModel.get('fileUri')
        )
        .on('error', function(error) {
            new CsvErrorNotificationView({
                'model': layerModel,
                'error': error.error[0].message,
            }).open();
        })
        .on('ready', layer => {
            let markerCluster = this._buildMarkerCluster(layerModel);

            this._customizeDataAndDisplay(
                layer.target._layers,
                markerCluster,
                layerModel,
                CONST.layerType.csv,
                hiddenLayer
            );
        });
    },

    addGeoJsonLayer: function (layerModel, hiddenLayer) {
        let omnivore = Omnivore.geojson(
            layerModel.get('fileUri')
        )
        .on('error', function(error) {
            new GeoJsonErrorNotificationView({
                'model': layerModel,
                'error': error.error[0].message,
            }).open();
        })
        .on('ready', layer => {
            let markerCluster = this._buildMarkerCluster(layerModel);

            this._customizeDataAndDisplay(
                layer.target._layers,
                markerCluster,
                layerModel,
                CONST.layerType.geojson,
                hiddenLayer
            );
        });
    },

    addOverPassCacheLayer: function (layerModel, hiddenLayer) {
        let omnivore = Omnivore.geojson(
            layerModel.get('fileUri')
        )
        .on('error', function(error) {
            new GeoJsonErrorNotificationView({
                'model': layerModel,
                'error': error.error[0].message,
            }).open();
        })
        .on('ready', layer => {
            let markerCluster = this._buildMarkerCluster(layerModel);

            this._customizeDataAndDisplay(
                layer.target._layers,
                markerCluster,
                layerModel,
                CONST.layerType.geojson,
                hiddenLayer
            );
        });
    },

    _customizeDataAndDisplay: function (objects, markerCluster, layerModel, dataSource, hiddenLayer) {
        const icon = MapUi.buildLayerIcon( L, layerModel );
        const style = MapUi.buildLayerPolylineStyle( layerModel );

        for (let i in objects) {
            let object = objects[i];
            const id = GeoJsonHelper.findOsmId(object.feature);
            const type = GeoJsonHelper.findOsmType(object.feature);
            const version = GeoJsonHelper.findOsmVersion(object.feature);

            if (Cache.exists(type, id)) {
                if (Cache.isNewerThanCache(type, id, version)) {
                    Cache.remove(type, id);
                }
                else {
                    object.feature = osmtogeojson({
                        'elements': [Cache.get(type, id, version)]
                    }).features[0];

                    if (object.feature.geometry.type === 'Point') {
                        object.setLatLng(
                            L.latLng([
                                object.feature.geometry.coordinates[1],
                                object.feature.geometry.coordinates[0]
                            ])
                        );
                    }
                }
            }

            let popupContent = this._buildLayerPopupContent(
                object,
                layerModel,
                object.feature
            );


            object._layerModel = layerModel;

            if ( this.model.get('infoDisplay') === CONST.infoDisplay.popup ) {
                this._bindPopupTo(object, popupContent);
            }

            object.on('click', this._displayInfo, this);

            if (object.feature.geometry.type === 'Point') {
                object.setIcon( icon );
            }
            else {
                object.setStyle( style );
            }

            markerCluster.addLayer(object);
        }

        this._markerClusters[ layerModel.cid ] = markerCluster;

        if ( !hiddenLayer ) {
            this.showLayer( layerModel );
        }
    },

    removeLayer: function (layerModel) {
        this.hideLayer( layerModel );
        delete this._markerClusters[ layerModel.cid ];

        if ( this._overPassLayers[ layerModel.cid ] ) {
            delete this._overPassLayers[ layerModel.cid ];
        }
    },

    showLayer: function (layerModel) {
        const markerCluster = this._markerClusters[ layerModel.cid ];
        const overPassLayer = this._overPassLayers[ layerModel.cid ];

        this._map.addLayer( markerCluster );

        if ( overPassLayer ) {
            this._map.addLayer( overPassLayer );
        }

        markerCluster.refreshClusters();
    },

    hideLayer: function (layerModel) {
        const markerCluster = this._markerClusters[ layerModel.cid ];
        const overPassLayer = this._overPassLayers[ layerModel.cid ];

        this._map.removeLayer( markerCluster );

        if ( overPassLayer ) {
            this._map.removeLayer( overPassLayer );
        }
    },

    updateLayerStyles: function (layerModel) {
        let markerCluster = this._markerClusters[ layerModel.cid ];
        let layers = markerCluster.getLayers();

        for (let layer of layers) {
            if (layer.feature.geometry.type === 'Point') {
                layer.refreshIconOptions(
                    MapUi.buildMarkerLayerIconOptions( layerModel )
                );
            }
            else {
                layer.setStyle(
                    MapUi.buildLayerPolylineStyle( layerModel )
                );
            }
        }

        markerCluster.refreshClusters();
    },

    updateLayerPopups: function (layerModel) {
        if (this.model.get('infoDisplay') !== CONST.infoDisplay.popup) {
            return false;
        }

        let markerCluster = this._markerClusters[ layerModel.cid ];
        let layers = markerCluster.getLayers();

        for (let layer of layers) {
            let popupContent = this._buildLayerPopupContent(
                layer,
                layerModel,
                layer.feature
            );

            if ( popupContent ) {
                if ( layer._popup ) {
                    layer._popup.setContent( popupContent );
                }
                else {
                    this._bindPopupTo(layer, popupContent);
                }
            }
            else {
                if ( layer._popup ) {
                    layer
                    .closePopup()
                    .unbindPopup();
                }
            }
        }
    },

    updateAllLayerPopups: function () {
        for (let layer of this._layerCollection.models) {
            this.updateLayerPopups(layer);
        }
    },

    updateLayerMinZoom: function (layerModel) {
        let overpassLayer = this._overPassLayers[ layerModel.cid ];

        if (overpassLayer.object) {
            overpassLayer.object.options.minZoom = layerModel.get('minZoom');
        }

        this.updateMinDataZoom();
    },

    updatePoiPopup: function (layerModel, overPassElement) {
        let markerCluster = this._markerClusters[ layerModel.cid ];
        let layers = markerCluster.getLayers();
        let osmId = `${overPassElement.type}/${overPassElement.id}`;

        for (let layer of layers) {
            if ( layer.feature.id === osmId ) {
                if (layer._popup) {
                    layer._popup.setContent(
                        this._buildLayerPopupContent(
                            layer,
                            layerModel,
                            {
                                'properties': {
                                    'type': overPassElement.type,
                                    'id': overPassElement.id,
                                    'tags': overPassElement.tags,
                                }
                            }
                        )
                    );
                }
            }
        }
    },

    _buildLayerPopupContent: function (layer, layerModel, feature) {
        const isLogged = this._app.isLogged();
        const dataEditable = layerModel.get('dataEditable');
        const content = InfoDisplay.buildContent(
            layerModel,
            feature,
            isLogged
        );
        let data;

        if ( !content && !dataEditable ) {
            return '';
        }

        if ( !content && !isLogged ) {
            return '';
        }

        if ( layerModel.get('type') !== CONST.layerType.overpass ) {
            return content;
        }

        let globalWrapper = this._document.createElement('div');
        globalWrapper.innerHTML = content;

        if ( isLogged && dataEditable ) {
            let editButton = this._document.createElement('button');

            if ( !content ) {
                globalWrapper.className = 'global_wrapper no_popup_content';
                editButton.className = 'btn btn-link edit_btn';
                editButton.innerHTML = this._document.l10n.getSync('editThatElement');
            }
            else {
                globalWrapper.className = 'global_wrapper has_popup_content';
                editButton.className = 'btn btn-default btn-sm edit_btn';
                editButton.innerHTML = '<i class="fa fa-pencil"></i>';
            }

            $(editButton).on(
                'click',
                this.onClickEditPoi.bind(
                    this,
                    layer,
                    feature.properties.type,
                    feature.properties.id,
                    layerModel
                )
            );

            globalWrapper.appendChild( editButton );
        }

        return globalWrapper;
    },

    _buildMarkerCluster: function (layerModel) {
        return L.markerClusterGroup({
            'polygonOptions': CONST.map.markerCLusterPolygonOptions,
            'animate': false,
            'animateAddingMarkers': false,
            'spiderfyOnMaxZoom': false,
            'disableClusteringAtZoom': 18,
            'zoomToBoundsOnClick': true,
            'iconCreateFunction': cluster => {
                let count = cluster.getChildCount();
                let color = layerModel.get('markerColor');

                return L.divIcon({
                    html: `<div class="marker-cluster ${color}">${count}</div>`
                });
            }
        });
    },

    onClickEditPoi: function (layer, osmType, osmId, layerModel, e) {
        let view = new EditPoiColumnView({
            'app': this._app,
            'osmType': osmType,
            'osmId': osmId,
            'layerModel': layerModel,
            'layer': layer,
        });

        this.getRegion('editPoiColumn').show( view );

        view.open();
    },

    renderUserButton: function () {
        if ( !this._app.isLogged() ) {
            this.ui.userButton
            .removeClass('avatar')
            .html('<i class="icon ion-happy-outline"></i>');
        }
        else {
            let avatar = this._user.get('avatar'),
            letters = this._user.get('displayName')
            .toUpperCase()
            .split(' ')
            .splice(0, 3)
            .map(function (name) {
                return name[0];
            })
            .join('');

            if (letters.length > 3) {
                letters = letters[0];
            }

            if (avatar) {
                this.ui.userButton
                .addClass('avatar')
                .html('<img src="'+ avatar +'" alt="'+ letters +'">');
            }
            else {
                this.ui.userButton
                .removeClass('avatar')
                .html(letters);
            }
        }
    },

    showContribButton: function () {
        this.ui.tempLayerButton.removeClass('hide');
        this.ui.contribButton.removeClass('hide');
    },

    hideContribButton: function () {
        this.ui.tempLayerButton.addClass('hide');
        this.ui.contribButton.addClass('hide');
    },

    showEditTools: function () {
        this.ui.editToolbar.removeClass('hide');
    },

    hideEditTools: function () {
        this.ui.editToolbar.addClass('hide');
    },

    onCommandEditOverPassLayer: function (layerModel) {
        let view;

        if ( layerModel ) {
            view = new EditOverPassLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }
        else {
            let layerModel = new LayerModel({
                'type': CONST.layerType.overpass
            });

            view = new EditOverPassLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
                'isNew': true,
            });
        }

        this.getRegion('editLayerFormColumn').show( view );

        view.open();
    },

    onCommandEditGpxLayer: function (layerModel) {
        let view;

        if ( layerModel ) {
            view = new EditGpxLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }
        else {
            let layerModel = new LayerModel({
                'type': CONST.layerType.gpx
            });

            view = new EditGpxLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
                'isNew': true,
            });
        }

        this.getRegion('editLayerFormColumn').show( view );

        view.open();
    },

    onCommandEditCsvLayer: function (layerModel) {
        let view;

        if ( layerModel ) {
            view = new EditCsvLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }
        else {
            let layerModel = new LayerModel({
                'type': CONST.layerType.csv
            });

            view = new EditCsvLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
                'isNew': true,
            });
        }

        this.getRegion('editLayerFormColumn').show( view );

        view.open();
    },

    onCommandEditGeoJsonLayer: function (layerModel) {
        let view;

        if ( layerModel ) {
            view = new EditGeoJsonLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }
        else {
            let layerModel = new LayerModel({
                'type': CONST.layerType.geojson
            });

            view = new EditGeoJsonLayerFormColumnView({
                'model': layerModel,
                'theme': this.model,
                'isNew': true,
            });
        }

        this.getRegion('editLayerFormColumn').show( view );

        view.open();
    },

    onCommandShowAddLayerMenu: function () {
        this._addLayerMenuColumnView.open();
    },

    onCommandShowContribColumn: function (center, layer) {
        this.showContribColumn(center, layer);
    },

    showContribColumn: function (options) {
        this._contribColumnView.setCenter(options.center);
        this._contribColumnView.open();
    },

    onCommandShowContribForm: function (options) {
        this.showContribForm(options);
    },

    showContribForm: function (options) {
        if (!options) {
            options = {'user': this._user};
        }
        else {
            options.user = this._user;
        }

        let view = new ContribFormColumnView( options );

        this.getRegion('contribFormColumn').show( view );

        view.open();
    },

    onCommandShowPresetTags: function (presetModel) {
        var view;

        if ( presetModel ) {
            view = new EditPresetTagsColumnView({
                'model': presetModel,
                'theme': this.model,
            });
        }
        else {
            let presetModel = new PresetModel();

            view = new EditPresetTagsColumnView({
                'model': presetModel,
                'theme': this.model,
                'isNew': true,
            });
        }

        this.getRegion('editPresetTagsColumn').show( view );

        view.open();
    },



    onCommandShowEditPoiMarker: function (layerModel) {
        var view = new EditLayerMarkerModalView({
            'model': layerModel
        });

        this.getRegion('editLayerMarkerModal').show( view );
    },

    onClickZoomIn: function () {
        this._map.zoomIn();
    },

    onClickZoomOut: function () {
        this._map.zoomOut();
    },

    onClickGeocode: function () {
        this._geocodeWidgetView.toggle();
    },

    onClickLocate: function () {
        this.showLocateProgress();
        this._geolocation.locate();
    },

    onClickLocateWait: function () {
        this.hideLocateProgress();
        this._geolocation.stopLocate();
    },

    onLocationFound: function () {
        this.hideLocateProgress();
    },

    onLocationError: function () {
        this.hideLocateProgress();
    },

    showLocateProgress: function () {
        this.ui.locateButton.addClass('hide');
        this.ui.locateWaitButton.removeClass('hide');
    },

    hideLocateProgress: function () {
        this.ui.locateWaitButton.addClass('hide');
        this.ui.locateButton.removeClass('hide');
    },

    updateSessionMapState: function () {
        var key = 'mapState-'+ this.model.get('fragment'),
        oldState = JSON.parse( localStorage.getItem( key ) ) || {},
        newState = _.extend( oldState, {
            'center': this._map.getCenter(),
            'zoomLevel': this._map.getZoom(),
        } );

        localStorage.setItem( key, JSON.stringify( newState ) );
    },

    onMoveEnd: function (e) {
        this._map.stopLocate();
        this.updateSessionMapState();
    },

    onZoomEnd: function (e) {
        this.ui.toolbarZoomLevel.text(
            this._map.getZoom()
        );
        this.checkZoomNotification();
        this.updateSessionMapState();
    },

    onZoomLevelsChange: function (e) {
        this.ui.toolbarZoomLevel.text(
            this._map.getZoom()
        );
        this.checkZoomNotification();
        this.updateSessionMapState();
    },

    updateMinDataZoom: function () {
        if (this._layerCollection.models.length === 0) {
            this._minDataZoom = 0;
        }
        else {
            let minDataZoom = 10000;

            for (let layerModel of this._layerCollection.models) {
                if ( layerModel.get('type') !== CONST.layerType.overpass ) {
                    continue;
                }

                if ( layerModel.get('cache') === true && layerModel.get('fileUri') ) {
                    continue;
                }

                if ( layerModel.get('minZoom') < minDataZoom ) {
                    minDataZoom = layerModel.get('minZoom');
                }
            }

            this._minDataZoom = (minDataZoom === 10000) ? 0 : minDataZoom;
        }

        this.checkZoomNotification();
    },

    checkZoomNotification: function () {
        if (this._map.getZoom() < this._minDataZoom ) {
            this.ui.zoomInButton.addClass('glow');

            if ( !this._seenZoomNotification ) {
                this._seenZoomNotification = true;

                this._zoomNotificationView.open();
            }
        }
        else if ( this._map.getZoom() >= this._minDataZoom ) {
            this.ui.zoomInButton.removeClass('glow');

            this._zoomNotificationView.close();
        }
    },

    onClickExpandScreen: function () {
        this._document.documentElement.requestFullscreen();
    },

    onClickCompressScreen: function () {
        this._document.exitFullscreen();
    },

    onExpandScreen: function () {
        this.ui.expandScreenButton.addClass('hide');
        this.ui.compressScreenButton.removeClass('hide');
    },

    onCompressScreen: function () {
        this.ui.compressScreenButton.addClass('hide');
        this.ui.expandScreenButton.removeClass('hide');
    },

    onClickSelectLayer: function () {
        this._selectLayerColumnView.open();
    },

    onClickSelectTile: function () {
        this._selectTileColumnView.open();
    },

    onClickHelp: function () {
        if ( this.ui.help.hasClass('open') ) {
            this.closeHelp();
        }
        else {
            this.openHelp();
        }
    },

    openHelp: function () {
        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');

        this.ui.help.addClass('open');
    },

    closeHelp: function () {
        this.ui.help.removeClass('open');
    },

    onClickHelpClose: function () {
        this.closeHelp();
    },

    onClickUser: function () {
        if ( this._app.isLogged() ) {
            this._userColumnView.open();
        }
        else {
            this._visitorColumnView.open();
        }
    },

    onClickLink: function () {
        this._linkColumnView.open();
    },

    onClickContrib: function (e) {
        const newPoiPlacementContextual = new NewPoiPlacementContextual({
            'collection': this._presetCollection,
            'user': this._user,
        }).open();
    },

    onClickEditSetting: function () {
        this._editSettingColumnView.open();
    },

    onClickEditLayer: function () {
        this._editLayerListColumnView.open();
    },

    onClickEditTile: function () {
        this._editTileColumnView.open();
    },

    onClickEditPreset: function () {
        this._editPresetColumnView.open();
    },

    setPosition: function (latLng, zoomLevel) {
        this._map.setView( latLng, zoomLevel, { 'animate': true } );
    },

    fitBounds: function (latLngBounds) {
        this._map.fitBounds( latLngBounds, { 'animate': true } );
    },

    onKeyDown: function (e) {
        switch ( e.keyCode ) {
            case 70:

                if ( e.ctrlKey ) {
                    e.preventDefault();

                    this.onClickGeocode();
                }
                break;
        }
    },

    isLargeScreen: function () {
        if ( $(this._window).width() >= this._config.largeScreenMinWidth && $(this._window).height() >= this._config.largeScreenMinHeight ) {
            return true;
        }

        return false;
    },

    onPopupOpen: function (e) {
        if ( !this.isLargeScreen() ) {
            this._geocodeWidgetView.close();

            this._zoomNotificationView.disappear();
            this.ui.leftToolbar.removeClass('open');
            this.ui.rightToolbar.removeClass('open');
        }
    },

    onPopupClose: function (e) {
        this.ui.leftToolbar.addClass('open');
        this.ui.rightToolbar.addClass('open');

        this._zoomNotificationView.appear();
    },

    _bindPopupTo: function (layer, popupContent) {
        if ( popupContent ) {
            let popupOptions;

            if ( this.isLargeScreen() ) {
                popupOptions = {
                    'closeButton': false,
                    'autoPanPaddingTopLeft': L.point(
                        CONST.map.panPadding.left,
                        CONST.map.panPadding.top
                    ),
                    'autoPanPaddingBottomRight': L.point(
                        CONST.map.panPadding.right,
                        CONST.map.panPadding.bottom
                    ),
                };
            }
            else {
                popupOptions = {
                    'closeButton': false,
                    'autoPanPadding': L.point(0, 0),
                };
            }

            let popup = L.popup( popupOptions ).setContent( popupContent );
            layer._popup = popup;
            layer.bindPopup( popup );
        }

        return false;
    },

    bindAllPopups: function () {
        const isLogged = this._app.isLogged();

        for (let i in this._markerClusters) {
            let markerCluster = this._markerClusters[i];
            let layers = markerCluster.getLayers();

            for (let layer of layers) {
                let content = this._buildLayerPopupContent(
                    layer,
                    layer._layerModel,
                    layer.feature
                );

                this._bindPopupTo(layer, content);
            }
        }
    },

    unbindAllPopups: function () {
        for (let i in this._markerClusters) {
            let markerCluster = this._markerClusters[i];
            let layers = markerCluster.getLayers();

            for (let layer of layers) {
                layer.closePopup().unbindPopup();
            }
        }
    },

    _displayInfo: function (e) {
        const layer = e.target;
        const dataEditable = layer._layerModel.get('dataEditable');
        const isLogged = this._app.isLogged();
        const content = InfoDisplay.buildContent(
            layer._layerModel,
            layer.feature,
            isLogged
        );
        const editAction = this.onClickEditPoi.bind(
            this,
            layer,
            layer.feature.properties.type,
            layer.feature.properties.id,
            layer._layerModel
        );

        if ( !content && !dataEditable ) {
            return false;
        }

        if ( !content && !isLogged ) {
            return false;
        }

        switch (this.model.get('infoDisplay')) {
            case CONST.infoDisplay.modal:
                this._infoDisplayView = new InfoDisplayModalView({
                    'layerModel': layer._layerModel,
                    content,
                    editAction,
                    isLogged,
                }).open();
                break;

            case CONST.infoDisplay.column:
                this._infoDisplayView = new InfoDisplayColumnView({
                    'layerModel': layer._layerModel,
                    content,
                    editAction,
                    isLogged,
                }).open();
                break;
        }
    },
});
