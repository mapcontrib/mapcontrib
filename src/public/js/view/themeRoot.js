
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from '../const';
import L from 'leaflet';
import OverPassLayer from 'leaflet-overpass-layer';
import MarkerCluster from 'leaflet.markercluster';
import marked from 'marked';
import fullScreenPolyfill from 'fullscreen-api-polyfill';

import ThemeTitleView from './themeTitle';
import LoginModalView from './loginModal';
import ConflictModalView from './conflictModal';
import GeocodeWidgetView from './geocodeWidget';
import SelectPoiColumnView from './selectPoiColumn';
import SelectTileColumnView from './selectTileColumn';
import UserColumnView from './userColumn';
import LinkColumnView from './linkColumn';
import ContribColumnView from './contribColumn';
import ContribFormColumnView from './contribFormColumn';
import EditSettingColumnView from './editSettingColumn';
import EditPoiColumnView from './editPoiColumn';
import EditLayerColumnView from './editLayerColumn';
import EditPoiMarkerModalView from './editPoiMarkerModal';
import EditTileColumnView from './editTileColumn';
import EditPresetColumnView from './editPresetColumn';
import EditPresetTagsColumnView from './editPresetTagsColumn';
import EditPoiDataColumnView from './editPoiDataColumn';
import ZoomNotificationView from './zoomNotification';
import OverpassTimeoutNotificationView from './overpassTimeoutNotification';
import OverpassErrorNotificationView from './overpassErrorNotification';

import LayerModel from '../model/layer';
import PresetModel from '../model/preset';
import OsmNodeModel from '../model/osmNode';

import MapUi from '../ui/map';
import Geolocation from '../core/geolocation';
import Cache from '../core/cache';
import MapData from '../core/mapData';

import template from '../../templates/themeRoot.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
    },

    ui: {
        'map': '#main_map',
        'toolbarButtons': '.toolbar .toolbar_btn',

        'controlToolbar': '#control_toolbar',
        'zoomInButton': '#control_toolbar .zoom_in_btn',
        'zoomOutButton': '#control_toolbar .zoom_out_btn',
        'toolbarZoomLevel': '#control_toolbar .zoom_level',
        'geocodeButton': '#control_toolbar .geocode_btn',
        'locateButton': '#control_toolbar .locate_btn',
        'locateWaitButton': '#control_toolbar .locate_wait_btn',
        'expandScreenButton': '#control_toolbar .expand_screen_btn',
        'compressScreenButton': '#control_toolbar .compress_screen_btn',
        'controlPoiButton': '#control_toolbar .poi_btn',
        'controlTileButton': '#control_toolbar .tile_btn',

        'userToolbar': '#user_toolbar',
        'loginButton': '#user_toolbar .login_btn',
        'userButton': '#user_toolbar .user_btn',
        'linkButton': '#user_toolbar .link_btn',
        'contribButton': '#user_toolbar .contrib_btn',

        'helpToolbar': '#help_toolbar',
        'helpButton': '#help_toolbar .help_btn',
        'help': '#help',
        'helpCloseButton': '#help .close_btn',

        'editToolbar': '#edit_toolbar',
        'editSettingButton': '#edit_toolbar .setting_btn',
        'editPoiButton': '#edit_toolbar .poi_btn',
        'editTileButton': '#edit_toolbar .tile_btn',
        'editPresetButton': '#edit_toolbar .preset_btn',

        'helpTextVersion': '#helpTextVersion',
    },

    regions: {
        'mainTitle': '#rg_main_title',

        'loginModal': '#rg_login_modal',
        'conflictModal': '#rg_conflict_modal',

        'geocodeWidget': '#rg_geocode_widget',

        'selectPoiColumn': '#rg_select_poi_column',
        'selectTileColumn': '#rg_select_tile_column',
        'userColumn': '#rg_user_column',
        'linkColumn': '#rg_link_column',
        'contribColumn': '#rg_contrib_column',
        'contribFormColumn': '#rg_contrib_form_column',
        'editSettingColumn': '#rg_edit_setting_column',
        'editPoiColumn': '#rg_edit_poi_column',
        'editLayerColumn': '#rg_edit_poi_layer_column',
        'editPoiMarkerModal': '#rg_edit_poi_marker_modal',
        'editTileColumn': '#rg_edit_tile_column',
        'editPresetColumn': '#rg_edit_preset_column',
        'editPresetTagsColumn': '#rg_edit_preset_tags_column',
        'editPoiDataColumn': '#rg_edit_poi_data_column',

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
        'click @ui.controlPoiButton': 'onClickSelectPoi',
        'click @ui.controlTileButton': 'onClickSelectTile',

        'click @ui.helpButton': 'onClickHelp',
        'click @ui.helpCloseButton': 'onClickHelpClose',

        'click @ui.loginButton': 'onClickLogin',
        'click @ui.userButton': 'onClickUser',
        'click @ui.linkButton': 'onClickLink',
        'click @ui.contribButton': 'onClickContrib',
        'click @ui.editSettingButton': 'onClickEditSetting',
        'click @ui.editPoiButton': 'onClickEditPoi',
        'click @ui.editTileButton': 'onClickEditTile',
        'click @ui.editPresetButton': 'onClickEditPreset',

        'keydown': 'onKeyDown',
    },

    initialize: function (app) {
        this._app = app;
        this.model = this._app.getTheme();
        this._layerCollection = this.model.get('layers');
        this._presetCollection = this.model.get('presets');
        this._user = this._app.getUser();

        this._window = this._app.getWindow();
        this._document = this._app.getDocument();

        this._seenZoomNotification = false;
        this._minDataZoom = 0;
        this._poiLoadingSpool = [];

        this._mapData = new MapData();

        this._radio = Wreqr.radio.channel('global');


        this._radio.reqres.setHandlers({
            'map:getCurrentZoom': (tileId) => {
                if (this._map) {
                    return this._map.getZoom();
                }
            },
            'getFragment': () => {
                return this.model.get('fragment');
            },
        });

        this._radio.commands.setHandlers({
            'theme:save': () => {
                this.model.save();
            },
            'column:showLayer': (layerModel) => {
                this.onCommandShowLayer( layerModel );
            },
            'column:showContribForm': (presetModel) => {
                this.onCommandShowContribForm( presetModel );
            },
            'column:showPresetTags': (presetModel) => {
                this.onCommandShowPresetTags( presetModel );
            },
            'modal:showEditPoiMarker': (layerModel) => {
                this.onCommandShowEditPoiMarker( layerModel );
            },
            'modal:showConflict': () => {
                this.onCommandShowConflict();
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
            'map:updateLayerIcons': (layerModel) => {
                this.updateLayerIcons( layerModel );
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
            'editPoiData': (osmElement, layerModel) => {
                this.onCommandEditPoiData( osmElement, layerModel );
            },
        });


        this._radio.vent.on('session:unlogged', () => {
            this.renderUserButtonNotLogged();
            this.hideContribButton();
            this.hideEditTools();
        });
    },

    onRender: function () {
        if ( this._app.isLogged() ) {
            this.renderUserButtonLogged();
            this.showContribButton();

            if ( this.model.isOwner(this._user) === true ) {
                this.showEditTools();
            }
        }
        else {
            this.renderUserButtonNotLogged();
            this.hideContribButton();
            this.hideEditTools();
        }


        this._geocodeWidgetView = new GeocodeWidgetView({ 'model': this.model });
        this._selectPoiColumnView = new SelectPoiColumnView({ 'model': this.model });
        this._selectTileColumnView = new SelectTileColumnView({ 'model': this.model });
        this._userColumnView = new UserColumnView();
        this._linkColumnView = new LinkColumnView({ 'model': this.model });
        this._contribColumnView = new ContribColumnView({ 'theme': this.model });
        this._editSettingColumnView = new EditSettingColumnView({ 'model': this.model });
        this._editPoiColumnView = new EditPoiColumnView({ 'model': this.model });
        this._editTileColumnView = new EditTileColumnView({ 'model': this.model });
        this._editPresetColumnView = new EditPresetColumnView({ 'model': this.model });

        this._zoomNotificationView = new ZoomNotificationView();


        this.getRegion('mainTitle').show( new ThemeTitleView({ 'model': this.model }) );

        this.getRegion('geocodeWidget').show( this._geocodeWidgetView );
        this.getRegion('selectPoiColumn').show( this._selectPoiColumnView );
        this.getRegion('selectTileColumn').show( this._selectTileColumnView );
        this.getRegion('userColumn').show( this._userColumnView );
        this.getRegion('linkColumn').show( this._linkColumnView );
        this.getRegion('contribColumn').show( this._contribColumnView );
        this.getRegion('editSettingColumn').show( this._editSettingColumnView );
        this.getRegion('editPoiColumn').show( this._editPoiColumnView );
        this.getRegion('editTileColumn').show( this._editTileColumnView );
        this.getRegion('editPresetColumn').show( this._editPresetColumnView );

        this.getRegion('zoomNotification').show( this._zoomNotificationView );


        if ( !this._document.fullscreenEnabled) {
            this.ui.expandScreenButton.addClass('hide');
            this.ui.compressScreenButton.addClass('hide');
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
                { 'version': CONST.version }
            )
        );
    },

    onShow: function () {
        var center = this.model.get('center'),
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

    showPoiLoadingProgress: function (layerModel) {
        if ( !this._poiLoadingSpool[ layerModel.cid ] ) {
            this._poiLoadingSpool[ layerModel.cid ] = 0;
        }

        this._poiLoadingSpool[ layerModel.cid ] += 1;

        $('i', this.ui.controlPoiButton).addClass('hide');
        $('.poi_loading', this.ui.controlPoiButton).removeClass('hide');
    },

    hidePoiLoadingProgress: function (layerModel) {
        if ( !this._poiLoadingSpool[ layerModel.cid ] ) {
            return;
        }

        this._poiLoadingSpool[ layerModel.cid ] -= 1;

        var countRequests = 0;

        for (var cid in this._poiLoadingSpool) {
            countRequests += this._poiLoadingSpool[cid];
        }

        if ( countRequests === 0) {
            $('.poi_loading', this.ui.controlPoiButton).addClass('hide');
            $('i', this.ui.controlPoiButton).removeClass('hide');
        }
    },

    addLayer: function (layerModel, hidden) {
        let split,
        layerGroup = L.layerGroup(),
        markerCluster = L.markerClusterGroup({
            'polygonOptions': CONST.map.markerCLusterPolygonOptions,
            'animate': false,
            'animateAddingMarkers': false,
            'iconCreateFunction': function(cluster) {
                let count = cluster.getChildCount();
                let color = layerModel.get('markerColor');

                return L.divIcon({
                    html: `<div class="marker-cluster ${color}">${count}</div>`
                });
            }
        }),
        overpassRequest = '',
        originalOverpassRequest = layerModel.get('overpassRequest') || '',
        overpassRequestSplit = originalOverpassRequest.split(';');


        overpassRequestSplit.forEach(function (row) {
            if ( !row.toLowerCase().trim() ) {
                return;
            }

            split = row.toLowerCase().trim().split(' ');

            if ( split[0] !== 'out' || split.indexOf('skel') !== -1 || split.indexOf('ids_only') !== -1 ) {
                overpassRequest += row + ';';
                return;
            }

            if ( split.indexOf('body') !== -1 ) {
                delete split[ split.indexOf('body') ];
            }

            if ( split.indexOf('center') === -1 ) {
                split.push('center');
            }

            if ( split.indexOf('meta') === -1 ) {
                split.push('meta');
            }

            overpassRequest += split.join(' ') + ';';
        });

        let overpassLayer = new OverPassLayer({
            'debug': config.debug,
            'endPoint': config.overpassServer,
            'minZoom': layerModel.get('minZoom'),
            'timeout': config.overpassTimeout,
            'retryOnTimeout': true,
            'query': overpassRequest,
            'beforeRequest': () => {
                this.showPoiLoadingProgress( layerModel );
            },
            'afterRequest': () => {
                this.hidePoiLoadingProgress( layerModel );
            },
            'onSuccess': (data) => {
                let wayBodyNodes = this._buildWayBodyNodesObjectFromOverpassResult(data),
                icon = MapUi.buildLayerIcon( L, layerModel );

                for (let e of data.elements) {
                    if( !e.tags ) {
                        continue;
                    }

                    if ( this._mapData.hasOsmElement(e, layerModel.cid) ) {
                        continue;
                    }

                    this._mapData.setOsmElement(e, layerModel.cid);

                    let popupContent = this.getLayerPopupContent(layerModel, e);

                    if( e.type === 'node' ) {
                        let pos = new L.LatLng(e.lat, e.lon);
                        let marker = L.marker(pos, {
                            'icon': icon
                        });

                        this._bindPopupTo(marker, popupContent);
                        markerCluster.addLayer( marker );
                        this._mapData.addMarker(marker, e, layerModel.cid);
                    }
                    else if ( e.nodes ) {
                        let nodePositions = this._buildPositionArrayFromWayBodyNodes(e, wayBodyNodes);
                        let isClosedPolygon = _.isEqual(
                            nodePositions[0],
                            nodePositions[ nodePositions.length - 1 ]
                        );

                        if ( isClosedPolygon ) {
                            let pos = new L.LatLng(e.center.lat, e.center.lon);
                            let marker = L.marker(pos, {
                                'icon': icon
                            });
                            let polygon = L.polygon(
                                nodePositions,
                                CONST.map.wayPolygonOptions
                            );


                            this._bindPopupTo(polygon, popupContent);
                            markerCluster.addLayer( polygon );
                            this._mapData.addPolygon(polygon, e, layerModel.cid);

                            this._bindPopupTo(marker, popupContent);
                            markerCluster.addLayer( marker );
                            this._mapData.addMarker(marker, e, layerModel.cid);
                        }
                        else {
                            let polyline = L.polyline(
                                nodePositions,
                                CONST.map.wayPolylineOptions
                            );

                            this._bindPopupTo(polyline, popupContent);
                            markerCluster.addLayer( polyline );
                            this._mapData.addPolyline(polyline, e, layerModel.cid);
                        }
                    }
                    else {
                        continue;
                    }
                }

                markerCluster.refreshClusters();
            },

            onTimeout: function (xhr) {
                var notification = new OverpassTimeoutNotificationView({ 'model': layerModel });

                notification.open();
            },

            onError: function (xhr) {
                var notification = new OverpassErrorNotificationView({ 'model': layerModel });

                notification.open();
            },
        });

        layerGroup.addLayer( markerCluster );
        layerGroup.addLayer( overpassLayer );

        this._mapData.setRootLayer(layerGroup, layerModel.cid);
        this._mapData.setMarkerCluster(markerCluster, layerModel.cid);
        this._mapData.setOverpassLayer(overpassLayer, layerModel.cid);

        if ( !hidden ) {
            this.showLayer( layerModel );
        }
    },

    removeLayer: function (layerModel) {
        this.hideLayer( layerModel );

        this._mapData.removeLayerId(layerModel.cid);
    },

    showLayer: function (layerModel) {
        this._map.addLayer(
            this._mapData.getRootLayer(layerModel.cid)
        );
    },

    hideLayer: function (layerModel) {
        this._map.removeLayer(
            this._mapData.getRootLayer(layerModel.cid)
        );
    },

    updateLayerIcons: function (layerModel) {
        let markers = this._mapData.getMarkersFromLayer(layerModel.cid);
        let markerCluster = this._mapData.getMarkerCluster(layerModel.cid);

        for (let marker of markers) {
            marker.refreshIconOptions(
                MapUi.buildLayerIconOptions( layerModel )
            );
        }

        markerCluster.refreshClusters();
    },

    updateLayerPopups: function (layerModel) {
        let osmElements = this._mapData.getOsmElements(layerModel.cid);

        for (let type in osmElements) {
            for (let id in osmElements[type]) {
                let osmElement = osmElements[type][id];
                let layers = this._mapData.getObjectsFromOsmElement(
                    osmElement,
                    layerModel.cid
                );

                for (let layer of layers) {
                    let popupContent = this.getLayerPopupContent( layerModel, osmElement );

                    if ( popupContent ) {
                        if ( layer._popup ) {
                            layer._popup.setContent( popupContent );
                        }
                        else {
                            layer.bindPopup(
                                L.popup({
                                    'autoPanPaddingTopLeft': L.point( CONST.map.panPadding.left, CONST.map.panPadding.top ),
                                    'autoPanPaddingBottomRight': L.point( CONST.map.panPadding.right, CONST.map.panPadding.bottom ),
                                })
                                .setContent( popupContent )
                            );
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
            }
        }
    },

    updateLayerMinZoom: function (layerModel) {
        let overpassLayer = this._mapData.getOverpassLayer(layerModel.cid);

        overpassLayer.options.minZoom = layerModel.get('minZoom');

        this.updateMinDataZoom();
    },

    updatePoiPopup: function (layerModel, osmElement) {
        this._mapData.setOsmElement(osmElement, layerModel.cid);

        let layers = this._mapData.getObjectsFromOsmElement(
            osmElement,
            layerModel.cid
        );

        for (let layer of layers) {
            layer.setPopupContent(
                this.getLayerPopupContent(
                    layerModel,
                    osmElement
                )
            );
        }
    },

    getLayerPopupContent: function (layerModel, osmElement) {
        if ( !layerModel.get('popupContent') ) {
            return '';
        }

        let re,
        type = osmElement.type,
        id = osmElement.id,
        version = osmElement.version,
        globalWrapper = this._document.createElement('div'),
        editButtonWrapper = this._document.createElement('div'),
        editButton = this._document.createElement('button'),
        popupContent = marked( layerModel.get('popupContent') );

        if (Cache.exists(type, id)) {
            if (Cache.isNewerThanCache(type, id, version)) {
                Cache.remove(type, id);
            }
            else {
                osmElement = Cache.get(type, id, version);
            }
        }

        for (var k in osmElement.tags) {
            re = new RegExp('{'+ k +'}', 'g');

            popupContent = popupContent.replace( re, osmElement.tags[k] );
        }

        popupContent = popupContent.replace( /\{(.*?)\}/g, '' );
        popupContent = popupContent.replace(
            /<a href=(.*?)>(.*?)<\/a>/g,
            '<a target="_blank" href=$1>$2</a>'
        );

        globalWrapper.innerHTML = popupContent;

        if ( layerModel.get('dataEditable') ) {
            editButton.className = 'btn btn-link';
            editButton.innerHTML = this._document.l10n.getSync('editTheseInformations');

            $(editButton).on('click', () => {
                this._radio.commands.execute('editPoiData', osmElement, layerModel);
            });

            editButtonWrapper.className = 'text-center prepend-xs-1 edit_poi_data';
            editButtonWrapper.appendChild( editButton );

            globalWrapper.appendChild( editButtonWrapper );
        }

        return globalWrapper;
    },

    onCommandEditPoiData: function (osmElement, layerModel) {
        var view = new EditPoiDataColumnView({
            'app': this._app,
            'osmElement': osmElement,
            'layerModel': layerModel,
        });

        this.getRegion('editPoiDataColumn').show( view );

        view.open();
    },

    renderUserButtonLogged: function () {
        var avatar = this._user.get('avatar'),
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

        this.ui.loginButton.addClass('hide');
        this.ui.userButton.removeClass('hide');
    },

    renderUserButtonNotLogged: function () {
        this.ui.loginButton.removeClass('hide');
        this.ui.userButton.addClass('hide');
    },

    showContribButton: function () {
        this.ui.contribButton.removeClass('hide');
    },

    hideContribButton: function () {
        this.ui.contribButton.addClass('hide');
    },

    showEditTools: function () {
        this.ui.editToolbar.removeClass('hide');
    },

    hideEditTools: function () {
        this.ui.editToolbar.addClass('hide');
    },



    onCommandShowLayer: function (layerModel) {
        var view;

        if ( layerModel ) {
            view = new EditLayerColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }
        else {
            let layerModel = new LayerModel();
            this.model.get('layers').add( layerModel );

            view = new EditLayerColumnView({
                'model': layerModel,
                'theme': this.model,
            });
        }

        this.getRegion('editLayerColumn').show( view );

        view.open();
    },

    onCommandShowContribForm: function (options) {
        this.showContribForm(options);
    },

    showContribForm: function (options) {
        options.user = this._user;

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
            this.model.get('presets').add( presetModel );

            view = new EditPresetTagsColumnView({
                'model': presetModel,
                'theme': this.model,
            });
        }

        this.getRegion('editPresetTagsColumn').show( view );

        view.open();
    },



    onCommandShowEditPoiMarker: function (layerModel) {
        var view = new EditPoiMarkerModalView({
            'model': layerModel
        });

        this.getRegion('editPoiMarkerModal').show( view );
    },

    onCommandShowConflict: function () {
        this.getRegion('conflictModal').show( new ConflictModalView() );
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
            let minDataZoom = 100000;

            _.each(this._layerCollection.models, function (layerModel) {
                if ( layerModel.get('minZoom') < minDataZoom ) {
                    minDataZoom = layerModel.get('minZoom');
                }
            }, this);

            this._minDataZoom = minDataZoom;
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

    onClickSelectPoi: function () {
        this._selectPoiColumnView.open();
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

        this.ui.helpToolbar.addClass('on_top');
        this.ui.help.addClass('open');
    },

    closeHelp: function () {
        this.ui.help.one('transitionend', () => {
            this.ui.helpToolbar.removeClass('on_top');
        });

        this.ui.help.removeClass('open');
    },

    onClickHelpClose: function () {
        this.closeHelp();
    },

    onClickLogin: function () {
        // FIXME To have a real fail callback
        let authSuccessCallback = this.model.buildPath();
        let authFailCallback = this.model.buildPath();

        this._loginModalView = new LoginModalView({
            'authSuccessCallback': authSuccessCallback,
            'authFailCallback': authFailCallback
        });

        this.getRegion('loginModal').show( this._loginModalView );
    },

    onClickUser: function () {
        this._userColumnView.open();
    },

    onClickLink: function () {
        this._linkColumnView.open();
    },

    onClickContrib: function (e) {
        let osmNodeModel = new OsmNodeModel({
            'type': 'node',
            'version': 0,
        });

        if ( this._presetCollection.models.length === 0 ) {
            this.showContribForm({
                'model': osmNodeModel
            });
        }
        else {
            this._contribColumnView.setModel( osmNodeModel );
            this._contribColumnView.open();
        }
    },

    onClickEditSetting: function () {
        this._editSettingColumnView.open();
    },

    onClickEditPoi: function () {
        this._editPoiColumnView.open();
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
        if ( $(this._window).width() >= config.largeScreenMinWidth && $(this._window).height() >= config.largeScreenMinHeight ) {
            return true;
        }

        return false;
    },

    onPopupOpen: function (e) {
        if ( !this.isLargeScreen() ) {
            this._geocodeWidgetView.close();

            this._toolbarsState = {
                'controlToolbar': this.ui.controlToolbar.hasClass('open'),
                'userToolbar': this.ui.userToolbar.hasClass('open'),
                'helpToolbar': this.ui.helpToolbar.hasClass('open'),
                'editToolbar': this.ui.editToolbar.hasClass('open'),
            };

            this._zoomNotificationView.disappear();
            this.ui.controlToolbar.removeClass('open');
            this.ui.userToolbar.removeClass('open');
            this.ui.helpToolbar.removeClass('open');
            this.ui.editToolbar.removeClass('open');
        }
    },

    onPopupClose: function (e) {
        for (var toolbar in this._toolbarsState) {
            if ( this._toolbarsState[toolbar] ) {
                this.ui[toolbar].addClass('open');
            }
        }

        this._zoomNotificationView.appear();
    },

    _buildWayBodyNodesObjectFromOverpassResult: function (overpassResult) {
        let wayBodyNodes = {};

        for (let element of overpassResult.elements) {
            if ( element.tags ) {
                continue;
            }

            wayBodyNodes[ element.id ] = element;
        }

        return wayBodyNodes;
    },

    _buildPositionArrayFromWayBodyNodes: function (element, wayBodyNodes) {
        let nodePositions = [];

        for (let node of element.nodes) {
            if ( wayBodyNodes[node] ) {
                nodePositions.push(
                    L.latLng(
                        wayBodyNodes[node].lat,
                        wayBodyNodes[node].lon
                    )
                );
            }
        }

        return nodePositions;
    },

    _bindPopupTo: function (element, popupContent) {
        if ( popupContent ) {
            let popupOptions;

            if ( this.isLargeScreen() ) {
                popupOptions = {
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
                    'autoPanPadding': L.point(0, 0),
                };
            }

            let popup = L.popup( popupOptions ).setContent( popupContent );
            element._popup = popup;
            element.bindPopup( popup );
        }

        return false;
    }
});
