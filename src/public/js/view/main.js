
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import settings from '../settings';
import CONST from '../const';
import L from 'leaflet';
import OverPassLayer from 'leaflet-overpass-layer';
import marked from 'marked';

import MainTitleView from './mainTitle';
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
import EditPoiLayerColumnView from './editPoiLayerColumn';
import EditPoiMarkerModalView from './editPoiMarkerModal';
import EditTileColumnView from './editTileColumn';
import EditPresetColumnView from './editPresetColumn';
import EditPresetTagsColumnView from './editPresetTagsColumn';
import EditPoiDataColumnView from './editPoiDataColumn';
import ZoomNotificationView from './zoomNotification';
import OverpassTimeoutNotificationView from './overpassTimeoutNotification';
import OverpassErrorNotificationView from './overpassErrorNotification';

import ThemeModel from '../model/theme';
import PoiLayerModel from '../model/poiLayer';
import PresetModel from '../model/preset';
import OsmNodeModel from '../model/osmNode';

import PoiLayerCollection from '../collection/poiLayer';
import PresetCollection from '../collection/preset';

import MapUi from '../ui/map';
import Geolocation from '../core/geolocation';

import mainTemplate from '../../templates/main.ejs';


export default Marionette.LayoutView.extend({

    template: mainTemplate,

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
        'editPoiLayerColumn': '#rg_edit_poi_layer_column',
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

    initialize: function () {

        this._seenZoomNotification = false;
        this._minDataZoom = 0;
        this._poiLoadingSpool = [];

        this._radio = Wreqr.radio.channel('global');

        this.model = new ThemeModel( window.theme );

        this._poiLayers = new PoiLayerCollection( window.poiLayers );
        this._presets = new PresetCollection( window.presets );


        this._radio.reqres.setHandlers({

            'poiLayers': (layerId) => {

                return this._poiLayers;
            },
            'presets': (layerId) => {

                return this._presets;
            },
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

            'column:showPoiLayer': (poiLayerModel) => {

                this.onCommandShowPoiLayer( poiLayerModel );
            },
            'column:showContribForm': (presetModel) => {

                this.onCommandShowContribForm( presetModel );
            },
            'column:showPresetTags': (presetModel) => {

                this.onCommandShowPresetTags( presetModel );
            },
            'modal:showEditPoiMarker': (poiLayerModel) => {

                this.onCommandShowEditPoiMarker( poiLayerModel );
            },
            'modal:showConflict': () => {

                this.onCommandShowConflict();
            },
            'map:setTileLayer': (tileId) => {

                this.setTileLayer( tileId );
            },
            'map:addPoiLayer': (poiLayerModel) => {

                this.addPoiLayer( poiLayerModel );
            },
            'map:removePoiLayer': (poiLayerModel) => {

                this.removePoiLayer( poiLayerModel );
            },
            'map:showPoiLayer': (poiLayerModel) => {

                this.showPoiLayer( poiLayerModel );
            },
            'map:hidePoiLayer': (poiLayerModel) => {

                this.hidePoiLayer( poiLayerModel );
            },
            'map:updatePoiLayerIcons': (poiLayerModel) => {

                this.updatePoiLayerIcons( poiLayerModel );
            },
            'map:updatePoiLayerPopups': (poiLayerModel) => {

                this.updatePoiLayerPopups( poiLayerModel );
            },
            'map:updatePoiLayerMinZoom': (poiLayerModel) => {

                this.updatePoiLayerMinZoom( poiLayerModel );
            },
            'map:updatePoiPopup': (poiLayerModel, node) => {

                this.updatePoiPopup( poiLayerModel, node );
            },
            'map:setPosition': (latLng, zoomLevel) => {

                this.setPosition( latLng, zoomLevel );
            },
            'map:fitBounds': (latLngBounds) => {

                this.fitBounds( latLngBounds );
            },
            'editPoiData': (dataFromOSM, poiLayerModel) => {

                this.onCommandEditPoiData( dataFromOSM, poiLayerModel );
            },
        });


        this._radio.vent.on('session:unlogged', () => {

            this.renderUserButtonNotLogged();
            this.hideContribButton();
            this.hideEditTools();
        });
    },

    onRender: function () {

        var isLogged = this._radio.reqres.request('var', 'isLogged'),
        userModel = this._radio.reqres.request('model', 'user');


        if ( isLogged ) {

            this.renderUserButtonLogged();
            this.showContribButton();

            if ( this.model.isOwner(userModel) === true ) {

                this.showEditTools();
            }
        }
        else {

            this.renderUserButtonNotLogged();
            this.hideContribButton();
            this.hideEditTools();
        }


        this._geocodeWidgetView = new GeocodeWidgetView();
        this._selectPoiColumnView = new SelectPoiColumnView();
        this._selectTileColumnView = new SelectTileColumnView({ 'model': this.model });
        this._userColumnView = new UserColumnView();
        this._linkColumnView = new LinkColumnView({ 'model': this.model });
        this._contribColumnView = new ContribColumnView({ 'model': this.model });
        this._editSettingColumnView = new EditSettingColumnView({ 'model': this.model });
        this._editPoiColumnView = new EditPoiColumnView({ 'model': this.model });
        this._editTileColumnView = new EditTileColumnView({ 'model': this.model });
        this._editPresetColumnView = new EditPresetColumnView({ 'model': this.model });

        this._zoomNotificationView = new ZoomNotificationView();


        this.getRegion('mainTitle').show( new MainTitleView({ 'model': this.model }) );

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



        if ( !document.fullscreenEnabled) {

            this.ui.expandScreenButton.addClass('hide');
            this.ui.compressScreenButton.addClass('hide');
        }

        $(window).on('fullscreenchange', () => {

            if ( document.fullscreenElement ) {

                this.onExpandScreen();
            }
            else {

                this.onCompressScreen();
            }
        });

        this.ui.helpTextVersion.html(
            document.l10n.getSync(
                'helpTextVersion',
                { 'version': CONST.version }
            )
        );
    },

    onShow: function () {

        var center = this.model.get('center'),
        zoomLevel = this.model.get('zoomLevel'),
        hiddenPoiLayers = [],
        storageMapState = localStorage.getItem('mapState-'+ this.model.get('fragment'));

        if ( storageMapState ) {

            storageMapState = JSON.parse( storageMapState );
            center = storageMapState.center;
            zoomLevel = storageMapState.zoomLevel;
            hiddenPoiLayers = storageMapState.hiddenPoiLayers || [];
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



        this._mapLayers = {};

        _.each(this._poiLayers.getVisibleLayers(), (poiLayerModel) => {

            if ( hiddenPoiLayers.indexOf(poiLayerModel.get('_id')) === -1 ) {

                this.addPoiLayer( poiLayerModel );
            }
            else {

                this.addPoiLayer( poiLayerModel, true );
            }
        }, this);


        this.updateMinDataZoom();

        this._poiLayers.on('add', (model) => {

            this.addPoiLayer(model);
        }, this);

        this._poiLayers.on('destroy', (model) => {

            this.removePoiLayer(model);
        }, this);


        this._geolocation = new Geolocation(this._map);
    },

    setTileLayer: function (id) {

        var tile, layer,
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

        layer = L.tileLayer(tile.urlTemplate, {

            'attribution': tile.attribution,
            'minZoom': tile.minZoom,
            'maxZoom': tile.maxZoom,
        });

        this._map.addLayer(layer);

        if ( this._currentTileLayer ) {

            this._map.removeLayer( this._currentTileLayer );
        }

        this._currentTileId = id;
        this._currentTileLayer = layer;

        this.updateMinDataZoom();
    },

    showPoiLoadingProgress: function (poiLayerModel) {

        if ( !this._poiLoadingSpool[ poiLayerModel.cid ] ) {

            this._poiLoadingSpool[ poiLayerModel.cid ] = 0;
        }

        this._poiLoadingSpool[ poiLayerModel.cid ] += 1;

        $('i', this.ui.controlPoiButton).addClass('hide');
        $('.poi_loading', this.ui.controlPoiButton).removeClass('hide');
    },

    hidePoiLoadingProgress: function (poiLayerModel) {

        if ( !this._poiLoadingSpool[ poiLayerModel.cid ] ) {

            return;
        }

        this._poiLoadingSpool[ poiLayerModel.cid ] -= 1;

        var countRequests = 0;

        for (var cid in this._poiLoadingSpool) {

            countRequests += this._poiLoadingSpool[cid];
        }

        if ( countRequests === 0) {

            $('.poi_loading', this.ui.controlPoiButton).addClass('hide');
            $('i', this.ui.controlPoiButton).removeClass('hide');
        }
    },

    addPoiLayer: function (poiLayerModel, hidden) {

        var split,
        layerGroup = L.layerGroup(),
        overpassRequest = '',
        overpassRequestSplit = poiLayerModel.get('overpassRequest').split(';');

        layerGroup._poiIds = [];

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



        layerGroup._overpassLayer = new OverPassLayer({

            'debug': settings.debug,
            'endPoint': settings.overpassServer,
            'minZoom': poiLayerModel.get('minZoom'),
            'timeout': settings.overpassTimeout,
            'retryOnTimeout': true,
            'query': overpassRequest,
            'beforeRequest': () => {

                this.showPoiLoadingProgress( poiLayerModel );
            },
            'afterRequest': () => {

                this.hidePoiLoadingProgress( poiLayerModel );
            },
            'onSuccess': (data) => {

                var wayBodyNodes = {},
                icon = MapUi.buildPoiLayerIcon( L, poiLayerModel );


                data.elements.forEach((e) => {

                    if ( e.tags ) {

                        return;
                    }

                    wayBodyNodes[e.id] = e;
                });


                data.elements.forEach((e) => {

                    if( !e.tags ) {

                        return;
                    }

                    if ( layerGroup._poiIds.indexOf(e.id) > -1 ) {

                        return;
                    }

                    layerGroup._poiIds.push(e.id);


                    var pos,
                    popupOptions = {};

                    if(e.type === 'node') {

                        pos = new L.LatLng(e.lat, e.lon);
                    }
                    else {

                        pos = new L.LatLng(e.center.lat, e.center.lon);

                        if ( e.nodes ) {

                            var nodePositions = [];

                            e.nodes.forEach((node) => {

                                if ( wayBodyNodes[node] ) {

                                    nodePositions.push(

                                        L.latLng(

                                            wayBodyNodes[node].lat,
                                            wayBodyNodes[node].lon
                                        )
                                    );
                                }
                            });

                            var polygon = L.polygon( nodePositions, CONST.map.wayPolygonOptions );

                            layerGroup.addLayer( polygon );
                        }
                    }


                    var popupContent = this.getPoiLayerPopupContent(poiLayerModel, e),
                    marker = L.marker(pos, {

                        'icon': icon
                    });

                    marker._dataFromOSM = e;

                    if ( popupContent ) {

                        if ( this.isLargeScreen() ) {

                            popupOptions = {

                                'autoPanPaddingTopLeft': L.point( CONST.map.panPadding.left, CONST.map.panPadding.top ),
                                'autoPanPaddingBottomRight': L.point( CONST.map.panPadding.right, CONST.map.panPadding.bottom ),
                            };
                        }
                        else {

                            popupOptions = {

                                'autoPanPadding': L.point(0, 0),
                            };
                        }

                        marker.bindPopup(

                            L.popup( popupOptions ).setContent( popupContent )
                        );
                    }

                    layerGroup.addLayer( marker );
                });
            },

            onTimeout: function (xhr) {

                var notification = new OverpassTimeoutNotificationView({ 'model': poiLayerModel });

                $('body').append( notification.el );

                notification.open();
            },

            onError: function (xhr) {

                var notification = new OverpassErrorNotificationView({ 'model': poiLayerModel });

                $('body').append( notification.el );

                notification.open();
            },
        });

        layerGroup.addLayer( layerGroup._overpassLayer );

        this._mapLayers[ poiLayerModel.cid ] = layerGroup;

        if ( !hidden ) {

            this.showPoiLayer( poiLayerModel );
        }
    },

    removePoiLayer: function (poiLayerModel) {

        this.hidePoiLayer( poiLayerModel );

        delete( this._mapLayers[ poiLayerModel.cid ] );
    },

    showPoiLayer: function (poiLayerModel) {

        this._map.addLayer( this._mapLayers[ poiLayerModel.cid ] );
    },

    hidePoiLayer: function (poiLayerModel) {

        this._map.removeLayer( this._mapLayers[ poiLayerModel.cid ] );
    },

    updatePoiLayerIcons: function (poiLayerModel) {

        this._mapLayers[ poiLayerModel.cid ].eachLayer(function (layer) {

            if ( layer._icon ) {

                layer.setIcon(
                    MapUi.buildPoiLayerIcon( L, poiLayerModel )
                );
            }
        });
    },

    updatePoiLayerPopups: function (poiLayerModel) {

        var popup,
        popupContent;

        this._mapLayers[ poiLayerModel.cid ].eachLayer((layer) => {

            if ( layer._dataFromOSM ) {

                popup = layer.getPopup();
                popupContent = this.getPoiLayerPopupContent( poiLayerModel, layer._dataFromOSM );

                if ( popupContent ) {

                    if ( popup ) {

                        popup.setContent( popupContent );
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

                    if ( popup ) {

                        layer
                        .closePopup()
                        .unbindPopup();
                    }
                }
            }
        });
    },

    updatePoiLayerMinZoom: function (poiLayerModel) {

        var overpassLayer = this._mapLayers[ poiLayerModel.cid ]._overpassLayer;

        overpassLayer.options.minZoom = poiLayerModel.get('minZoom');

        this.updateMinDataZoom();
    },

    updatePoiPopup: function (poiLayerModel, node) {

        this._mapLayers[ poiLayerModel.cid ].eachLayer((layer) => {

            if ( !layer._dataFromOSM || layer._dataFromOSM.id !== node.id ) {

                return;
            }

            layer._dataFromOSM = node;

            layer.setPopupContent( this.getPoiLayerPopupContent( poiLayerModel, layer._dataFromOSM ) );
        });
    },

    getPoiLayerPopupContent: function (poiLayerModel, dataFromOSM) {

        if ( !poiLayerModel.get('popupContent') ) {

            return '';
        }

        var re,
        globalWrapper = document.createElement('div'),
        editButtonWrapper = document.createElement('div'),
        editButton = document.createElement('button'),
        popupContent = marked( poiLayerModel.get('popupContent') ),
        contributionKey = dataFromOSM.type +'-'+ dataFromOSM.id,
        contributions = JSON.parse( localStorage.getItem('contributions') ) || {};

        if ( contributions[ contributionKey ] ) {

            if ( dataFromOSM.version >= contributions[ contributionKey ].version ) {

                delete contributions[ contributionKey ];

                localStorage.setItem('contributions', JSON.stringify( contributions ));
            }
            else {

                dataFromOSM = contributions[ contributionKey ];
            }
        }

        for (var k in dataFromOSM.tags) {

            re = new RegExp('{'+ k +'}', 'g');

            popupContent = popupContent.replace( re, dataFromOSM.tags[k] );
        }

        popupContent = popupContent.replace( /\{(.*?)\}/g, '' );
        popupContent = popupContent.replace(
            /<a href=(.*?)>(.*?)<\/a>/g,
            '<a target="_blank" href=$1>$2</a>'
        );

        globalWrapper.innerHTML = popupContent;

        if ( poiLayerModel.get('dataEditable') ) {

            editButton.className = 'btn btn-link';
            editButton.innerHTML = document.l10n.getSync('editTheseInformations');

            $(editButton).on('click', () => {

                this._radio.commands.execute('editPoiData', dataFromOSM, poiLayerModel);
            });

            editButtonWrapper.className = 'text-center prepend-xs-1 edit_poi_data';
            editButtonWrapper.appendChild( editButton );

            globalWrapper.appendChild( editButtonWrapper );
        }

        return globalWrapper;
    },

    onCommandEditPoiData: function (dataFromOSM, poiLayerModel) {

        var view = new EditPoiDataColumnView({

            'dataFromOSM': dataFromOSM,
            'poiLayerModel': poiLayerModel,
        });

        this.getRegion('editPoiDataColumn').show( view );

        view.open();
    },

    renderUserButtonLogged: function () {

        var user = this._radio.reqres.request('model', 'user'),
        avatar = user.get('avatar'),
        letters = user.get('displayName')
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



    onCommandShowPoiLayer: function (poiLayerModel) {

        var view;

        if ( poiLayerModel ) {

            view = new EditPoiLayerColumnView({

                'model': poiLayerModel
            });
        }
        else {

            view = new EditPoiLayerColumnView({

                'model': new PoiLayerModel({ 'themeId': this.model.get('_id') })
            });
        }

        this.getRegion('editPoiLayerColumn').show( view );

        view.open();
    },

    onCommandShowContribForm: function (options) {

        this.showContribForm(options);
    },

    showContribForm: function (options) {

        var view = new ContribFormColumnView(options);

        this.getRegion('contribFormColumn').show( view );

        view.open();
    },

    onCommandShowPresetTags: function (presetModel) {

        var view;

        if ( presetModel ) {

            view = new EditPresetTagsColumnView({

                'model': presetModel
            });
        }
        else {

            view = new EditPresetTagsColumnView({

                'model': new PresetModel({ 'themeId': this.model.get('_id') })
            });
        }

        this.getRegion('editPresetTagsColumn').show( view );

        view.open();
    },



    onCommandShowEditPoiMarker: function (poiLayerModel) {

        var view = new EditPoiMarkerModalView({

            'model': poiLayerModel
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

        var minDataZoom = 100000;

        _.each(this._poiLayers.models, function (poiLayerModel) {

            if ( poiLayerModel.get('minZoom') < minDataZoom ) {

                minDataZoom = poiLayerModel.get('minZoom');
            }
        }, this);

        this._minDataZoom = minDataZoom;

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

        document.documentElement.requestFullscreen();
    },

    onClickCompressScreen: function () {

        document.exitFullscreen();
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

        let authCallback = `/t/${this.model.get('fragment')}-${this.model.buildWebLinkName()}`;

        this._loginModalView = new LoginModalView({
            'authCallback': authCallback
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

        e.stopPropagation();

        this.showContribCrosshair();

        this._map.once('click', this.onClickMapToAddPoint.bind(this));

        $('body').one('click.contribCrosshair', this.hideContribCrosshair.bind(this) );
        $('body').on('keyup.contribCrosshair', (e) => {

            if ( e.keyCode === 27 ) {

                this.hideContribCrosshair();
            }
        });
    },

    onClickMapToAddPoint: function (e) {

        var osmNodeModel = new OsmNodeModel({

            'lat': e.latlng.lat,
            'lng': e.latlng.lng,
        });

        if ( this._presets.models.length === 0 ) {

            this.showContribForm({
                'model': osmNodeModel
            });
        }
        else {

            this._contribColumnView.setModel( osmNodeModel );
            this._contribColumnView.open();
        }
    },

    showContribCrosshair: function () {

        this.ui.map.css('cursor', 'crosshair');
    },

    hideContribCrosshair: function () {

        $('body').off('.contribCrosshair', this.hideContribCrosshair.bind(this) );

        this.ui.map.css('cursor', 'default');
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

        if ( $(window).width() >= settings.largeScreenMinWidth && $(window).height() >= settings.largeScreenMinHeight ) {

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
    },
});
