
'use strict';


var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var settings = require('../settings');
var CONST = require('../const');
var L = require('leaflet');
var OverPassLayer = require('leaflet-overpass-layer');
var marked = require('marked');

var MainTitleView = require('./mainTitle');
var LoginModalView = require('./loginModal');
var ConflictModalView = require('./conflictModal');
var GeocodeWidgetView = require('./geocodeWidget');
var SelectPoiColumnView = require('./selectPoiColumn');
var SelectTileColumnView = require('./selectTileColumn');
var UserColumnView = require('./userColumn');
var LinkColumnView = require('./linkColumn');
var ContribColumnView = require('./contribColumn');
var ContribFormColumnView = require('./contribFormColumn');
var EditSettingColumnView = require('./editSettingColumn');
var EditPoiColumnView = require('./editPoiColumn');
var EditPoiLayerColumnView = require('./editPoiLayerColumn');
var EditPoiMarkerModalView = require('./editPoiMarkerModal');
var EditTileColumnView = require('./editTileColumn');
var EditPresetColumnView = require('./editPresetColumn');
var EditPresetTagsColumnView = require('./editPresetTagsColumn');
var EditPoiDataColumnView = require('./editPoiDataColumn');
var ZoomNotificationView = require('./zoomNotification');
var OverpassTimeoutNotificationView = require('./overpassTimeoutNotification');
var OverpassErrorNotificationView = require('./overpassErrorNotification');

var ThemeModel = require('../model/theme');
var PoiLayerModel = require('../model/poiLayer');
var PresetModel = require('../model/preset');
var OsmNodeModel = require('../model/osmNode');

var PoiLayerCollection = require('../collection/poiLayer');
var PresetCollection = require('../collection/preset');

var MapUi = require('../ui/map');


module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/main.ejs'),

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

        var self = this;

        this._seenZoomNotification = false;
        this._minDataZoom = 0;
        this._poiLoadingSpool = [];

        this._radio = Wreqr.radio.channel('global');

        this.model = new ThemeModel( window.theme );

        this._poiLayers = new PoiLayerCollection( window.poiLayers );
        this._presets = new PresetCollection( window.presets );


        this._radio.reqres.setHandlers({

            'poiLayers': function (layerId) {

                return self._poiLayers;
            },
            'presets': function (layerId) {

                return self._presets;
            },
            'map:getCurrentZoom': function (tileId) {

                if (self._map) {

                    return self._map.getZoom();
                }
            },
            'getFragment': function () {

                return self.model.get('fragment');
            },
        });

        this._radio.commands.setHandlers({

            'column:showPoiLayer': function (poiLayerModel) {

                self.onCommandShowPoiLayer( poiLayerModel );
            },
            'column:showContribForm': function (presetModel) {

                self.onCommandShowContribForm( presetModel );
            },
            'column:showPresetTags': function (presetModel) {

                self.onCommandShowPresetTags( presetModel );
            },
            'modal:showEditPoiMarker': function (poiLayerModel) {

                self.onCommandShowEditPoiMarker( poiLayerModel );
            },
            'modal:showConflict': function () {

                self.onCommandShowConflict();
            },
            'map:setTileLayer': function (tileId) {

                self.setTileLayer( tileId );
            },
            'map:addPoiLayer': function (poiLayerModel) {

                self.addPoiLayer( poiLayerModel );
            },
            'map:removePoiLayer': function (poiLayerModel) {

                self.removePoiLayer( poiLayerModel );
            },
            'map:showPoiLayer': function (poiLayerModel) {

                self.showPoiLayer( poiLayerModel );
            },
            'map:hidePoiLayer': function (poiLayerModel) {

                self.hidePoiLayer( poiLayerModel );
            },
            'map:updatePoiLayerIcons': function (poiLayerModel) {

                self.updatePoiLayerIcons( poiLayerModel );
            },
            'map:updatePoiLayerPopups': function (poiLayerModel) {

                self.updatePoiLayerPopups( poiLayerModel );
            },
            'map:updatePoiLayerMinZoom': function (poiLayerModel) {

                self.updatePoiLayerMinZoom( poiLayerModel );
            },
            'map:updatePoiPopup': function (poiLayerModel, node) {

                self.updatePoiPopup( poiLayerModel, node );
            },
            'map:setPosition': function (latLng, zoomLevel) {

                self.setPosition( latLng, zoomLevel );
            },
            'map:fitBounds': function (latLngBounds) {

                self.fitBounds( latLngBounds );
            },
            'editPoiData': function (dataFromOSM, poiLayerModel) {

                self.onCommandEditPoiData( dataFromOSM, poiLayerModel );
            },
        });


        this._radio.vent.on('session:unlogged', function (){

            self.renderUserButtonNotLogged();
            self.hideContribButton();
            self.hideEditTools();
        });
    },

    onRender: function () {

        var self = this,
        isLogged = this._radio.reqres.request('var', 'isLogged'),
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

        $(window).on('fullscreenchange', function () {

            if ( document.fullscreenElement ) {

                self.onExpandScreen();
            }
            else {

                self.onCompressScreen();
            }
        });
    },

    onShow: function () {

        var self = this,
        center = this.model.get('center'),
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
        this._radio.reqres.setHandler('map', function () {

            return self._map;
        });

        this._map
        .setView([center.lat, center.lng], zoomLevel)
        .on('popupopen', function (e) {

            self.onPopupOpen(e);
        })
        .on('popupclose', function (e) {

            self.onPopupClose(e);
        })
        .on('moveend', function (e) {

            self.onMoveEnd();
        })
        .on('zoomend', function (e) {

            self.onZoomEnd(e);
            self._radio.vent.trigger('map:zoomChanged');
        })
        .on('zoomlevelschange', function (e) {

            self.onZoomLevelsChange(e);
            self._radio.vent.trigger('map:zoomChanged');
        })
        .on('locationfound', function () {

            self.onLocationFound();
        })
        .on('locationerror', function () {

            self.onLocationError();
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

        _.each(this._poiLayers.getVisibleLayers(), function (poiLayerModel) {

            if ( hiddenPoiLayers.indexOf(poiLayerModel.get('_id')) === -1 ) {

                this.addPoiLayer( poiLayerModel );
            }
            else {

                this.addPoiLayer( poiLayerModel, true );
            }
        }, this);


        this.updateMinDataZoom();

        this._poiLayers.on('add', function (model) {

            this.addPoiLayer(model);
        }, this);

        this._poiLayers.on('destroy', function (model) {

            this.removePoiLayer(model);
        }, this);
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
        self = this,
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
            'beforeRequest': function () {

                self.showPoiLoadingProgress( poiLayerModel );
            },
            'afterRequest': function () {

                self.hidePoiLoadingProgress( poiLayerModel );
            },
            'onSuccess': function(data) {

                var wayBodyNodes = {},
                icon = MapUi.buildPoiLayerIcon( poiLayerModel );


                data.elements.forEach(function (e) {

                    if ( e.tags ) {

                        return;
                    }

                    wayBodyNodes[e.id] = e;
                });


                data.elements.forEach(function (e) {

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

                            e.nodes.forEach(function (node) {

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


                    var popupContent = self.getPoiLayerPopupContent(poiLayerModel, e),
                    marker = L.marker(pos, {

                        'icon': icon
                    });

                    marker._dataFromOSM = e;

                    if ( popupContent ) {

                        if ( self.isLargeScreen() ) {

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

        var self = this;

        this._mapLayers[ poiLayerModel.cid ].eachLayer(function (layer) {

            if ( layer._icon ) {

                layer.setIcon(
                    MapUi.buildPoiLayerIcon( poiLayerModel )
                );
            }
        });
    },

    updatePoiLayerPopups: function (poiLayerModel) {

        var popup,
        popupContent,
        self = this;

        this._mapLayers[ poiLayerModel.cid ].eachLayer(function (layer) {

            if ( layer._dataFromOSM ) {

                popup = layer.getPopup();
                popupContent = self.getPoiLayerPopupContent( poiLayerModel, layer._dataFromOSM );

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

        var self = this,
        overpassLayer = this._mapLayers[ poiLayerModel.cid ]._overpassLayer;

        overpassLayer.options.minZoom = poiLayerModel.get('minZoom');

        this.updateMinDataZoom();
    },

    updatePoiPopup: function (poiLayerModel, node) {

        var self = this;

        this._mapLayers[ poiLayerModel.cid ].eachLayer(function (layer) {

            if ( !layer._dataFromOSM || layer._dataFromOSM.id !== node.id ) {

                return;
            }

            layer._dataFromOSM = node;

            layer.setPopupContent( self.getPoiLayerPopupContent( poiLayerModel, layer._dataFromOSM ) );
        });
    },

    getPoiLayerPopupContent: function (poiLayerModel, dataFromOSM) {

        if ( !poiLayerModel.get('popupContent') ) {

            return '';
        }

        var re,
        self = this,
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

            $(editButton).on('click', function () {

                self._radio.commands.execute('editPoiData', dataFromOSM, poiLayerModel);
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

        this.ui.locateButton.addClass('hide');
        this.ui.locateWaitButton.removeClass('hide');

        this._map.locate({

            'watch': true,
            'setView': true,
            'enableHighAccuracy': true,
        });
    },

    onClickLocateWait: function () {

        this._map.stopLocate();
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

    onLocationFound: function () {

        this.ui.locateWaitButton.addClass('hide');
        this.ui.locateButton.removeClass('hide');
    },

    onLocationError: function () {

        this.ui.locateWaitButton.addClass('hide');
        this.ui.locateButton.removeClass('hide');
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

        var self = this;

        if ( this.ui.help.hasClass('open') ) {

            this.ui.help.one('transitionend', function () {

                self.ui.helpToolbar.removeClass('on_top');
            });

            this.ui.help.removeClass('open');
        }
        else {

            this._radio.vent.trigger('column:closeAll');
            this._radio.vent.trigger('widget:closeAll');

            this.ui.helpToolbar.addClass('on_top');
            this.ui.help.addClass('open');
        }
    },

    onClickHelpClose: function () {

        var self = this;

        this.ui.help.removeClass('open', function () {

            self.ui.helpToolbar.removeClass('on_top');
        });
    },

    onClickLogin: function () {

        var self = this;

        this._loginModalView = new LoginModalView({ 'fragment': this.model.get('fragment') });

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

        var self = this;

        this.showContribCrosshair();

        this._map.once('click', this.onClickMapToAddPoint.bind(this));

        $('body').one('click.contribCrosshair', this.hideContribCrosshair.bind(this) );
        $('body').on('keyup.contribCrosshair', function (e) {

            if ( e.keyCode === 27 ) {

                self.hideContribCrosshair();
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
