
import $ from 'jquery';
import _ from 'underscore';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';
import osmtogeojson from 'osmtogeojson';
import OverPassLayer from 'leaflet-overpass-layer';
import Omnivore from 'leaflet-omnivore';
import moment from 'moment-timezone';


import LayerModel from 'model/layer';

import MapUi from 'ui/map';
import Geolocation from 'core/geolocation';
import OverPassData from 'core/overPassData';
import InfoDisplay from 'core/infoDisplay';
import OverPassHelper from 'helper/overPass';
import GeoJsonHelper from 'helper/geoJson';
import FullscreenHelper from 'helper/fullscreen';

import template from 'templates/themeRoot.ejs';

import ThemeTitleView from './themeTitle';
import InfoDisplayModalView from './infoDisplayModal';
import InfoDisplayColumnView from './infoDisplayColumn';
import GeocodeWidgetView from './geocodeWidget';
import ZoomNotificationView from './zoomNotification';
import OverPassTimeoutNotificationView from './overPassTimeoutNotification';
import OverPassErrorNotificationView from './overPassErrorNotification';
import CsvErrorNotificationView from './csvErrorNotification';
import GeoJsonErrorNotificationView from './geoJsonErrorNotification';
import GpxErrorNotificationView from './gpxErrorNotification';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
    },

    ui: {
        map: '#main_map',
        toolbarButtons: '.toolbar .toolbar_btn',


        leftToolbar: '#left_toolbar',
        controlToolbar: '#control_toolbar',
        zoomInButton: '#control_toolbar .zoom_in_btn',
        zoomOutButton: '#control_toolbar .zoom_out_btn',
        toolbarZoomLevel: '#control_toolbar .zoom_level',
        geocodeButton: '#control_toolbar .geocode_btn',
        geocodeIcon: '#control_toolbar .geocode_btn i',
        geocodeSpinner: '#control_toolbar .geocode_btn .spinner',
        locateButton: '#control_toolbar .locate_btn',
        locateWaitButton: '#control_toolbar .locate_wait_btn',
        expandScreenButton: '#control_toolbar .expand_screen_btn',
        compressScreenButton: '#control_toolbar .compress_screen_btn',
        controlLayerIcon: '#control_toolbar .layer_btn i',
        controlLayerSpinner: '#control_toolbar .layer_btn .spinner',

        rightToolbar: '#right_toolbar',
        userToolbar: '#user_toolbar',
        userButton: '#user_toolbar .user_btn',
        contribButton: '#contrib_toolbar .contrib_btn',

        editToolbar: '#edit_toolbar',
    },

    regions: {
        mainTitle: '#rg_main_title',
        geocodeWidget: '#rg_geocode_widget',
        zoomNotification: '#rg_zoom_notification',
    },

    events: {
        'click @ui.zoomInButton': 'onClickZoomIn',
        'click @ui.zoomOutButton': 'onClickZoomOut',
        'click @ui.geocodeButton': 'onClickGeocode',
        'click @ui.locateButton': 'onClickLocate',
        'click @ui.locateWaitButton': 'onClickLocateWait',
        'click @ui.expandScreenButton': 'onClickExpandScreen',
        'click @ui.compressScreenButton': 'onClickCompressScreen',

        keydown: 'onKeyDown',
    },

    initialize(options) {
        this._app = options.app;
        this._user = this._app.getUser();
        this._config = this._app.getConfig();

        this.model = this._app.getTheme();

        this._layerCollection = this.model.get('layers');
        this._tempLayerCollection = this._app.getTempLayerCollection();
        this._nonOsmData = this._app.getNonOsmData();
        this._osmCache = this._app.getOsmCache();

        this._window = this._app.getWindow();
        this._document = this._app.getDocument();

        this._seenZoomNotification = false;
        this._minDataZoom = 0;
        this._poiLoadingSpool = [];

        this._overPassData = new OverPassData();
        this._rootLayers = {};
        this._overPassLayers = {};
        this._markersWithoutLayers = {};

        this._radio = Wreqr.radio.channel('global');


        this._radio.reqres.setHandlers({
            'user:isOwner': () => this.model.isOwner( this._user ),
            theme: () => this.model,
            nonOsmData: () => this._nonOsmData,
            osmCache: () => this._osmCache,
            overPassData: () => this._overPassData,
            'theme:fragment': () => this.model.get('fragment'),
            'map:currentZoom': () => {
                if (this._map) {
                    return this._map.getZoom();
                }

                return false;
            },
            'map:currentCenter': () => {
                if (this._map) {
                    return this._map.getCenter();
                }

                return false;
            },
            'map:currentBounds': () => {
                if (this._map) {
                    return this._map.getBounds();
                }

                return false;
            },
            'map:markerCluster': layerModel => this._getRootLayer(layerModel),
            'edition-data': () => this._editionData,
        });

        this._radio.commands.setHandlers({
            'set:edition-data': (data) => {
                this._editionData = data;
            },
            'theme:save': () => {
                this.model.updateModificationDate();
                this.model.save();
            },
            'map:position': (zoom, lat, lng) => {
                this.setMapPosition( zoom, lat, lng );
            },
            'map:setTileLayer': (tileId) => {
                this.setTileLayer( tileId );
            },
            'layer:updateOverPassRequest': (layerModel) => {
                this.updateOverPassRequest( layerModel );
            },
            'map:addLayer': (layerModel) => {
                this.addLayer( layerModel );
            },
            'map:addTempLayer': (layerModel, fileContent) => {
                this.addTempLayer( layerModel, fileContent );
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
            'map:updateRepresentation': (layerModel) => {
                this.updateRepresentation( layerModel );
            },
            'map:updateMarkerStyle': (layerModel) => {
                this.updateMarkerStyle( layerModel );
            },
            'map:updateHeatStyle': (layerModel) => {
                this.updateHeatStyle( layerModel );
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
            saveOverPassData: (overPassElement, layerModel) => {
                this._overPassData.save(overPassElement, layerModel.cid);
            },
        });

        this._radio.vent.on('session:unlogged', () => {
            this.renderUserButton();
            this.hideContribButton();
            this.hideEditTools();
            this.updateAllLayerPopups();
        });
    },

    onRender() {
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
            model: this.model,
            icon: this.ui.geocodeIcon,
            spinner: this.ui.geocodeSpinner,
        });
        this._zoomNotificationView = new ZoomNotificationView();


        this.getRegion('mainTitle').show( new ThemeTitleView({ model: this.model }) );
        this.getRegion('geocodeWidget').show( this._geocodeWidgetView );
        this.getRegion('zoomNotification').show( this._zoomNotificationView );


        const fullscreenSupport = FullscreenHelper.isFullscreenAPISupported( this._document );

        if ( !fullscreenSupport ) {
            this.ui.expandScreenButton.addClass('hide');
            this.ui.compressScreenButton.addClass('hide');
        }

        FullscreenHelper.onFullscreenChange(window, () => {
            const fullscreenElement = FullscreenHelper.getFullscreenElement(this._document);

            if ( fullscreenElement ) {
                this.onExpandScreen();
            }
            else {
                this.onCompressScreen();
            }
        });
    },

    onShow() {
        const autoCenter = this.model.get('autoCenter');
        const fragment = this.model.get('fragment');
        let center = this.model.get('center');
        let zoomLevel = this.model.get('zoomLevel');
        let hiddenLayers = [];
        let storageMapState = localStorage.getItem(`mapState-${fragment}`);

        if ( storageMapState ) {
            storageMapState = JSON.parse( storageMapState );
            center = storageMapState.center;
            zoomLevel = storageMapState.zoomLevel;
            hiddenLayers = storageMapState.hiddenLayers || [];
        }

        this.ui.toolbarButtons.tooltip({
            container: 'body',
            delay: {
                show: CONST.tooltip.showDelay,
                hide: CONST.tooltip.hideDelay,
            },
        })
        .on('click', (e) => {
            $(e.currentTarget)
            .blur()
            .tooltip('hide');
        });


        this._map = L.map(this.ui.map[0], { zoomControl: false });

        this.ui.map.focus();

        this._radio.reqres.removeHandler('map');
        this._radio.reqres.setHandler('map', () => this._map);

        this._map
        .setView([center.lat, center.lng], zoomLevel)
        .on('popupopen', (e) => {
            this.onPopupOpen(e);
        })
        .on('popupclose', (e) => {
            this.onPopupClose(e);
        })
        .on('moveend', () => {
            this.onMoveEnd();
            this._radio.vent.trigger('map:centerChanged');
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
        .on('locationtimeout', () => {
            this.onLocationTimeout();
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
            position: 'bottomright',
        }).addTo(this._map);


        _.each(this._layerCollection.getVisibleLayers(), (layerModel) => {
            if ( hiddenLayers.indexOf(layerModel.get('uuid')) === -1 ) {
                this.addLayer( layerModel );
            }
            else {
                this.addLayer( layerModel, true );
            }
        }, this);


        const newerOsmCacheModels = this._osmCache.where({ osmVersion: 0 });

        for (const i in newerOsmCacheModels) {
            if ( !{}.hasOwnProperty.call(newerOsmCacheModels, i) ) {
                continue;
            }

            const osmCacheModel = newerOsmCacheModels[i];
            const osmElement = osmCacheModel.get('osmElement');
            const id = osmCacheModel.get('osmId');
            const type = osmCacheModel.get('osmType');
            const longId = `${type}/${id}`;
            const pos = new L.LatLng(
                osmElement.attributes.lat,
                osmElement.attributes.lon
            );

            const oneDayAgo = moment.utc().subtract(1, 'days');
            const modificationDate = moment.utc(
                osmCacheModel.get('modificationDate')
            );
            if (modificationDate.isBefore(oneDayAgo)) {
                osmCacheModel.destroy();
                continue;
            }

            const icon = MapUi.buildLayerIcon(
                new LayerModel({
                    markerShape: MAPCONTRIB.config.newPoiMarkerShape,
                    markerIconType: CONST.map.markerIconType.library,
                    markerIcon: MAPCONTRIB.config.newPoiMarkerIcon,
                    markerColor: MAPCONTRIB.config.newPoiMarkerColor,
                })
            );

            this._markersWithoutLayers[longId] = L.marker(pos, { icon });

            this._map.addLayer( this._markersWithoutLayers[longId] );
        }


        this.updateMinDataZoom();

        this._layerCollection.on('destroy', (model) => {
            this.removeLayer(model);
        }, this);

        this._tempLayerCollection.on('destroy', (model) => {
            this.removeLayer(model);
        }, this);


        this._geolocation = new Geolocation(this._map);

        if ( autoCenter ) {
            this.onClickLocate();
        }
    },

    setMapPosition(zoom, lat, lng) {
        this._map.setView([lat, lng], zoom);
    },

    setTileLayer(oldId) {
        let tiles = this.model.get('tiles');
        let id = oldId;
        const tileLayersGroup = L.layerGroup();

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

        const tile = CONST.map.tiles[id];

        if (!tile) {
            return;
        }

        for (const urlTemplate of tile.urlTemplate) {
            tileLayersGroup.addLayer(
                L.tileLayer(urlTemplate, {
                    attribution: tile.attribution,
                    minZoom: tile.minZoom,
                    maxZoom: tile.maxZoom,
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

    updateOverPassRequest(layerModel) {
        this._overPassData.clearLayerData(layerModel.cid);

        this._getRootLayer(layerModel).clearLayers();
        this._getOverPassLayer(layerModel).setQuery(
            OverPassHelper.buildRequestForTheme(
                layerModel.get('overpassRequest') || ''
            )
        );
    },

    showLayerLoadingProgress(layerModel) {
        if ( !this._poiLoadingSpool[layerModel.cid] ) {
            this._poiLoadingSpool[layerModel.cid] = 0;
        }

        this._poiLoadingSpool[layerModel.cid] += 1;

        this.ui.controlLayerIcon.addClass('hide');
        this.ui.controlLayerSpinner.removeClass('hide');
    },

    hideLayerLoadingProgress(layerModel) {
        if ( !this._poiLoadingSpool[layerModel.cid] ) {
            return;
        }

        this._poiLoadingSpool[layerModel.cid] -= 1;

        let countRequests = 0;

        for (const cid in this._poiLoadingSpool) {
            if ({}.hasOwnProperty.call(this._poiLoadingSpool, cid)) {
                countRequests += this._poiLoadingSpool[cid];
            }
        }

        if ( countRequests === 0) {
            this.ui.controlLayerSpinner.addClass('hide');
            this.ui.controlLayerIcon.removeClass('hide');
        }
    },

    addTempLayer(layerModel, fileContent) {
        switch (layerModel.get('type')) {
            case CONST.layerType.overpass:
                return this.addOverPassLayer(layerModel);
            case CONST.layerType.gpx:
                return this.addTempGpxLayer(layerModel, fileContent);
            case CONST.layerType.csv:
                return this.addTempCsvLayer(layerModel, fileContent);
            case CONST.layerType.geojson:
                return this.addTempGeoJsonLayer(layerModel, fileContent);
            default:
                return false;
        }
    },

    addTempGpxLayer(layerModel, fileContent) {
        const rootLayer = this._buildRootLayer(layerModel);
        const layer = Omnivore.gpx.parse(
            fileContent
        );

        if ( !layer._leaflet_id ) {
            new GpxErrorNotificationView({
                model: layerModel,
                error: document.l10n.getSync('invalidFile'),
            }).open();
        }
        else {
            layerModel.addObjects(layer._layers);

            this._customizeDataAndDisplay(
                layer._layers,
                rootLayer,
                layerModel,
                CONST.layerType.gpx
            );
        }
    },

    addTempCsvLayer(layerModel, fileContent) {
        const rootLayer = this._buildRootLayer(layerModel);
        const layer = Omnivore.csv.parse(
            fileContent
        );

        if ( !layer._leaflet_id ) {
            new CsvErrorNotificationView({
                model: layerModel,
                error: document.l10n.getSync('invalidFile'),
            }).open();
        }
        else {
            layerModel.addObjects(layer._layers);

            this._customizeDataAndDisplay(
                layer._layers,
                rootLayer,
                layerModel,
                CONST.layerType.csv
            );
        }
    },

    addTempGeoJsonLayer(layerModel, fileContent) {
        const rootLayer = this._buildRootLayer(layerModel);
        const layer = L.geoJson(
            JSON.parse( fileContent )
        );

        if ( !layer._leaflet_id ) {
            new GeoJsonErrorNotificationView({
                model: layerModel,
                error: document.l10n.getSync('invalidFile'),
            }).open();
        }
        else {
            layerModel.addObjects(layer._layers);

            this._customizeDataAndDisplay(
                layer._layers,
                rootLayer,
                layerModel,
                CONST.layerType.geojson
            );
        }
    },

    addLayer(layerModel, hidden) {
        switch (layerModel.get('type')) {
            case CONST.layerType.overpass:
                return this.addOverPassLayer(layerModel, hidden);
            case CONST.layerType.gpx:
                return this.addGpxLayer(layerModel, hidden);
            case CONST.layerType.csv:
                return this.addCsvLayer(layerModel, hidden);
            case CONST.layerType.geojson:
                return this.addGeoJsonLayer(layerModel, hidden);
            default:
                return false;
        }
    },

    addOverPassLayer(layerModel, hiddenLayer) {
        const cache = layerModel.get('cache');
        const cacheFilePath = layerModel.get('fileUri');

        const rootLayer = this._buildRootLayer(layerModel);
        this._setRootLayer(layerModel, rootLayer);
        this._map.addLayer( rootLayer );

        if (cache && cacheFilePath) {
            this.addOverPassCacheLayer(rootLayer, layerModel, hiddenLayer);
        }

        const overPassRequest = OverPassHelper.buildRequestForTheme(
            layerModel.get('overpassRequest') || ''
        );

        const loadedBounds = [];

        if (layerModel.get('cacheBounds')) {
            loadedBounds.push(layerModel.get('cacheBounds'));
        }

        const overPassLayer = new OverPassLayer({
            loadedBounds,
            debug: this._config.debug,
            endPoint: this._config.overPassEndPoint,
            minZoom: layerModel.get('minZoom'),
            timeout: this._config.overPassTimeout,
            retryOnTimeout: true,
            query: overPassRequest,
            beforeRequest: () => {
                this.showLayerLoadingProgress( layerModel );
            },
            afterRequest: () => {
                this.hideLayerLoadingProgress( layerModel );
            },
            onSuccess: (receivedData) => {
                const data = { ...receivedData };
                const objects = {};
                const elements = [];

                for (const i in data.elements) {
                    if ({}.hasOwnProperty.call(data.elements, i)) {
                        const e = data.elements[i];

                        if ( this._overPassData.exists(e.type, e.id, layerModel.cid) ) {
                            continue;
                        }

                        elements.push(e);
                        this._overPassData.save(e, layerModel.cid);
                    }
                }

                data.elements = elements;

                let i = 1;

                L.geoJson(
                    osmtogeojson(data),
                    {
                        onEachFeature(feature, layer) {
                            objects[i] = layer;
                            i += 1;
                        },
                    }
                );

                layerModel.addObjects(objects);

                this._customizeDataAndDisplay(
                    objects,
                    this._getRootLayer(layerModel),
                    layerModel,
                    CONST.layerType.overpass,
                    hiddenLayer
                );
            },

            onTimeout() {
                new OverPassTimeoutNotificationView({
                    model: layerModel,
                }).open();
            },

            onError(xhr) {
                new OverPassErrorNotificationView({
                    model: layerModel,
                    error: xhr.statusText,
                }).open();
            },
        });

        this._setOverPassLayer(layerModel, overPassLayer);

        if (!hiddenLayer) {
            this._map.addLayer( overPassLayer );
        }

        return true;
    },

    addGpxLayer(layerModel, hiddenLayer) {
        Omnivore.gpx(
            layerModel.get('fileUri')
        )
        .on('error', (xhr) => {
            if (xhr.error.status === 404) {
                new GpxErrorNotificationView({
                    model: layerModel,
                    error: document.l10n.getSync('fileNotFound'),
                }).open();
            }
        })
        .on('ready', (layer) => {
            const rootLayer = this._buildRootLayer(layerModel);

            layerModel.addObjects(layer.target._layers);

            this._customizeDataAndDisplay(
                layer.target._layers,
                rootLayer,
                layerModel,
                CONST.layerType.gpx,
                hiddenLayer
            );
        });
    },

    addCsvLayer(layerModel, hiddenLayer) {
        Omnivore.csv(
            layerModel.get('fileUri')
        )
        .on('error', (xhr) => {
            if (xhr.error.status === 404) {
                new CsvErrorNotificationView({
                    model: layerModel,
                    error: document.l10n.getSync('fileNotFound'),
                }).open();
            }
        })
        .on('ready', (layer) => {
            const rootLayer = this._buildRootLayer(layerModel);

            layerModel.addObjects(layer.target._layers);

            this._customizeDataAndDisplay(
                layer.target._layers,
                rootLayer,
                layerModel,
                CONST.layerType.csv,
                hiddenLayer
            );
        });
    },

    addGeoJsonLayer(layerModel, hiddenLayer) {
        Omnivore.geojson(
            layerModel.get('fileUri')
        )
        .on('error', (xhr) => {
            if (xhr.error.status === 404) {
                new GeoJsonErrorNotificationView({
                    model: layerModel,
                    error: document.l10n.getSync('fileNotFound'),
                }).open();
            }
        })
        .on('ready', (layer) => {
            const rootLayer = this._buildRootLayer(layerModel);

            layerModel.addObjects(layer.target._layers);

            this._customizeDataAndDisplay(
                layer.target._layers,
                rootLayer,
                layerModel,
                CONST.layerType.geojson,
                hiddenLayer
            );
        });
    },

    addOverPassCacheLayer(rootLayer, layerModel, hiddenLayer) {
        Omnivore.geojson(
            layerModel.get('fileUri')
        )
        .on('ready', (layer) => {
            const deletedFeatures = L.geoJson(layerModel.get('cacheDeletedFeatures'));
            const layers = {
                ...deletedFeatures._layers,
                ...layer.target._layers,
            };

            layerModel.addObjects(layers);

            for (const index in layers) {
                if ({}.hasOwnProperty.call(layers, index)) {
                    this._overPassData.save(
                        layers[index].feature.properties,
                        layerModel.cid
                    );
                }
            }

            this._customizeDataAndDisplay(
                layers,
                rootLayer,
                layerModel,
                CONST.layerType.geojson,
                hiddenLayer
            );
        });
    },

    _customizeDataAndDisplay(objects, rootLayer, layerModel, dataSource, hiddenLayer) {
        const icon = MapUi.buildLayerIcon( layerModel );
        const polygonStyle = MapUi.buildLayerPolygonStyle( layerModel );
        const polylineStyle = MapUi.buildLayerPolylineStyle( layerModel );

        for (const i in objects) {
            if ( !{}.hasOwnProperty.call(objects, i) ) {
                continue;
            }

            const object = objects[i];
            const id = GeoJsonHelper.findOsmId(object.feature);
            const type = GeoJsonHelper.findOsmType(object.feature);
            const longId = OverPassData.buildOsmIdFromTypeAndId(type, id);
            const version = GeoJsonHelper.findOsmVersion(object.feature);
            const osmCacheModel = this._osmCache.findWhere({
                themeFragment: this.model.get('fragment'),
                osmId: id,
                osmType: type,
            });

            if ( this._markersWithoutLayers[longId] ) {
                this._map.removeLayer( this._markersWithoutLayers[longId] );
            }

            if ( osmCacheModel ) {
                if ( osmCacheModel.get('osmVersion') <= version) {
                    osmCacheModel.destroy();
                }
                else {
                    object.feature = GeoJsonHelper.hydrateFeatureFromOverPassElement(
                        object.feature,
                        osmCacheModel.get('overPassElement')
                    );

                    if (object.feature.geometry.type === 'Point') {
                        object.setLatLng(
                            L.latLng([
                                object.feature.geometry.coordinates[0],
                                object.feature.geometry.coordinates[1],
                            ])
                        );
                    }
                }
            }

            object._layerModel = layerModel;

            if (layerModel.get('rootLayerType') !== CONST.rootLayerType.heat) {
                const popupContent = this._buildLayerPopupContent(
                    object,
                    layerModel,
                    object.feature
                );

                object.off('click');

                if ( this.model.get('infoDisplay') === CONST.infoDisplay.popup ) {
                    this._bindPopupTo(object, popupContent);
                }

                object.on('click', this._displayInfo, this);

                switch (object.feature.geometry.type) {
                    case 'Point':
                    case 'MultiPoint':
                        object.setIcon( icon );
                        break;
                    case 'LineString':
                    case 'MultiLineString':
                        object.setStyle( polylineStyle );
                        break;
                    case 'Polygon':
                    case 'MultiPolygon':
                        object.setStyle( polygonStyle );
                        break;
                    default:
                        object.setIcon( icon );
                        break;
                }
            }

            rootLayer.addLayer(object);
        }

        this._setRootLayer(layerModel, rootLayer);

        if ( !hiddenLayer ) {
            this.showLayer( layerModel );
        }
    },

    removeLayer(layerModel) {
        this.hideLayer( layerModel );
        this._removeRootLayer(layerModel);
        this._removeOverPassLayer(layerModel);
    },

    showLayer(layerModel) {
        const rootLayer = this._getRootLayer(layerModel);
        const overPassLayer = this._getOverPassLayer(layerModel);

        this._map.addLayer( rootLayer );

        if ( overPassLayer ) {
            this._map.addLayer( overPassLayer );
        }

        this._refreshTopLayer(layerModel);
    },

    hideLayer(layerModel) {
        const rootLayer = this._getRootLayer(layerModel);
        const overPassLayer = this._getOverPassLayer(layerModel);

        this._map.removeLayer( rootLayer );

        if ( overPassLayer ) {
            this._map.removeLayer( overPassLayer );
        }
    },

    updateRepresentation(layerModel) {
        const hiddenLayer = false;
        let rootLayer = this._getRootLayer(layerModel);

        this._map.removeLayer(rootLayer);
        this._removeRootLayer(layerModel);

        rootLayer = this._buildRootLayer(layerModel);

        this._customizeDataAndDisplay(
            layerModel.getObjects(),
            rootLayer,
            layerModel,
            layerModel.get('type'),
            hiddenLayer
        );
    },

    updateMarkerStyle(layerModel) {
        const rootLayer = this._getRootLayer(layerModel);
        const layers = rootLayer.getLayers();

        for (const layer of layers) {
            switch (layer.toGeoJSON().geometry.type) {
                case 'Point':
                case 'MultiPoint':
                    layer.refreshIconOptions(
                        MapUi.buildMarkerLayerIconOptions( layerModel )
                    );
                    break;
                case 'LineString':
                case 'MultiLineString':
                    layer.setStyle(
                        MapUi.buildLayerPolylineStyle( layerModel )
                    );
                    break;
                case 'Polygon':
                case 'MultiPolygon':
                    layer.setStyle(
                        MapUi.buildLayerPolygonStyle( layerModel )
                    );
                    break;
                default:
                    layer.refreshIconOptions(
                        MapUi.buildMarkerLayerIconOptions( layerModel )
                    );
            }
        }

        this._refreshTopLayer(layerModel);
    },

    updateHeatStyle(layerModel) {
        const rootLayer = this._getRootLayer(layerModel);

        rootLayer.setOptions(
            MapUi.buildHeatLayerOptions(layerModel)
        );

        this._refreshTopLayer(layerModel);
    },

    updateLayerPopups(layerModel) {
        if (this.model.get('infoDisplay') !== CONST.infoDisplay.popup) {
            return false;
        }

        const layers = this._getRootLayer(layerModel).getLayers();

        for (const layer of layers) {
            const popupContent = this._buildLayerPopupContent(
                layer,
                layerModel,
                layer.feature
            );

            if ( popupContent && layer._popup ) {
                layer._popup.setContent( popupContent );
            }
            else if ( popupContent && !layer._popup ) {
                this._bindPopupTo(layer, popupContent);
            }
            else if ( !popupContent && layer._popup ) {
                layer
                .closePopup()
                .unbindPopup();
            }
        }

        return true;
    },

    updateAllLayerPopups() {
        for (const layer of this._layerCollection.models) {
            this.updateLayerPopups(layer);
        }
    },

    updateLayerMinZoom(layerModel) {
        const overpassLayer = this._getOverPassLayer(layerModel);

        if (overpassLayer.object) {
            overpassLayer.object.options.minZoom = layerModel.get('minZoom');
        }

        this.updateMinDataZoom();
    },

    updatePoiPopup(layerModel, overPassElement) {
        const layers = this._getRootLayer(layerModel).getLayers();
        const osmId = `${overPassElement.type}/${overPassElement.id}`;

        for (const layer of layers) {
            if ( layer.feature.id === osmId ) {
                layer.feature = GeoJsonHelper.hydrateFeatureFromOverPassElement(
                    layer.feature,
                    overPassElement
                );

                if (layer._popup) {
                    layer._popup.setContent(
                        this._buildLayerPopupContent(
                            layer,
                            layerModel,
                            {
                                properties: {
                                    type: overPassElement.type,
                                    id: overPassElement.id,
                                    tags: overPassElement.tags,
                                },
                            }
                        )
                    );
                }
            }
        }
    },

    _buildLayerPopupContent(layer, layerModel, feature) {
        const isLogged = this._app.isLogged();
        const nonOsmData = this._nonOsmData.findWhere({
            themeFragment: this.model.get('fragment'),
            osmId: feature.properties.id,
            osmType: feature.properties.type,
        });
        const content = InfoDisplay.buildContent(
            layerModel,
            feature,
            nonOsmData ? nonOsmData.get('tags') : [],
            isLogged
        );

        if ( !content ) {
            return '';
        }

        if ( !content && !isLogged ) {
            return '';
        }

        if ( layerModel.get('type') !== CONST.layerType.overpass ) {
            return content;
        }

        const globalWrapper = this._document.createElement('div');
        globalWrapper.innerHTML = content;

        if ( isLogged ) {
            const osmType = feature.properties.type;
            const osmId = feature.properties.id;
            const editButton = this._document.createElement('a');
            editButton.href = `contribute/edit/${osmType}/${osmId}`;

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

            globalWrapper.appendChild( editButton );

            $(editButton).on('click', () => {
                this._radio.commands.execute('set:edition-data', {
                    layer,
                    layerModel,
                });
            });
        }

        return globalWrapper;
    },

    _buildRootLayer(layerModel) {
        switch (layerModel.get('rootLayerType')) {
            case CONST.rootLayerType.markerCluster:
                return MapUi.buildMarkerClusterLayer(layerModel);

            case CONST.rootLayerType.heat:
                return MapUi.buildHeatLayer(layerModel);

            default:
                return MapUi.buildMarkerClusterLayer(layerModel);
        }
    },

    _refreshTopLayer(layerModel) {
        const rootLayer = this._getRootLayer(layerModel);

        switch (layerModel.get('rootLayerType')) {
            case CONST.rootLayerType.markerCluster:
                return rootLayer.refreshClusters();

            case CONST.rootLayerType.heat:
                return rootLayer.redraw();

            default:
                return rootLayer.refreshClusters();
        }
    },

    renderUserButton() {
        if ( !this._app.isLogged() ) {
            this.ui.userButton
            .removeClass('avatar')
            .html('<i class="icon ion-happy-outline"></i>');
        }
        else {
            const avatar = this._user.get('avatar');
            let letters = this._user.get('displayName')
            .toUpperCase()
            .split(' ')
            .splice(0, 3)
            .map(name => name[0])
            .join('');

            if (letters.length > 3) {
                letters = letters[0];
            }

            if (avatar) {
                this.ui.userButton
                .addClass('avatar')
                .html(`<img src="${avatar}" alt="${letters}">`);
            }
            else {
                this.ui.userButton
                .removeClass('avatar')
                .html(letters);
            }
        }
    },

    showContribButton() {
        this.ui.contribButton.removeClass('hide');
    },

    hideContribButton() {
        this.ui.contribButton.addClass('hide');
    },

    showEditTools() {
        this.ui.editToolbar.removeClass('hide');
    },

    hideEditTools() {
        this.ui.editToolbar.addClass('hide');
    },

    onClickZoomIn() {
        this._map.zoomIn();
    },

    onClickZoomOut() {
        this._map.zoomOut();
    },

    onClickGeocode() {
        this._geocodeWidgetView.toggle();
    },

    onClickLocate() {
        this.showLocateProgress();
        this._geolocation.locate();
    },

    onClickLocateWait() {
        this.hideLocateProgress();
        this._geolocation.stopLocate();
    },

    onLocationFound() {
        this.hideLocateProgress();
    },

    onLocationTimeout() {
        this.hideLocateProgress();
    },

    onLocationError() {
        this.hideLocateProgress();
    },

    showLocateProgress() {
        this.ui.locateButton.addClass('hide');
        this.ui.locateWaitButton.removeClass('hide');
    },

    hideLocateProgress() {
        this.ui.locateWaitButton.addClass('hide');
        this.ui.locateButton.removeClass('hide');
    },

    updateSessionMapState() {
        const fragment = this.model.get('fragment');
        const key = `mapState-${fragment}`;
        const oldState = JSON.parse( localStorage.getItem( key ) ) || {};
        const newState = {
            ...oldState,
            ...{
                center: this._map.getCenter(),
                zoomLevel: this._map.getZoom(),
            },
        };

        localStorage.setItem( key, JSON.stringify( newState ) );
    },

    onMoveEnd() {
        this._map.stopLocate();
        this.updateSessionMapState();
    },

    onZoomEnd() {
        this.ui.toolbarZoomLevel.text(
            this._map.getZoom()
        );
        this.checkZoomNotification();
        this.updateSessionMapState();
    },

    onZoomLevelsChange() {
        this.ui.toolbarZoomLevel.text(
            this._map.getZoom()
        );
        this.checkZoomNotification();
        this.updateSessionMapState();
    },

    updateMinDataZoom() {
        if (this._layerCollection.models.length === 0) {
            this._minDataZoom = 0;
        }
        else {
            let minDataZoom = 10000;

            for (const layerModel of this._layerCollection.models) {
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

    checkZoomNotification() {
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

    onClickExpandScreen() {
        FullscreenHelper.requestFullscreen(
            this._document.documentElement
        );
    },

    onClickCompressScreen() {
        FullscreenHelper.exitFullscreen( this._document );
    },

    onExpandScreen() {
        this.ui.expandScreenButton.addClass('hide');
        this.ui.compressScreenButton.removeClass('hide');
    },

    onCompressScreen() {
        this.ui.compressScreenButton.addClass('hide');
        this.ui.expandScreenButton.removeClass('hide');
    },

    setPosition(latLng, zoomLevel) {
        this._map.setView( latLng, zoomLevel, { animate: true } );
    },

    fitBounds(latLngBounds) {
        this._map.fitBounds( latLngBounds, { animate: true } );
    },

    onKeyDown(e) {
        switch ( e.keyCode ) {
            case 70:

                if ( e.ctrlKey ) {
                    e.preventDefault();

                    this.onClickGeocode();
                }
                break;
            default:
        }
    },

    isLargeScreen() {
        if (
            $(this._window).width() >= this._config.largeScreenMinWidth &&
            $(this._window).height() >= this._config.largeScreenMinHeight
        ) {
            return true;
        }

        return false;
    },

    onPopupOpen() {
        if ( !this.isLargeScreen() ) {
            this._geocodeWidgetView.close();

            this._zoomNotificationView.disappear();
            this.ui.leftToolbar.removeClass('open');
            this.ui.rightToolbar.removeClass('open');
        }
    },

    onPopupClose() {
        this.ui.leftToolbar.addClass('open');
        this.ui.rightToolbar.addClass('open');

        this._zoomNotificationView.appear();
    },

    _bindPopupTo(layer, popupContent) {
        if ( popupContent ) {
            let popupOptions;

            if ( this.isLargeScreen() ) {
                popupOptions = {
                    closeButton: false,
                    autoPanPaddingTopLeft: L.point(
                        CONST.map.panPadding.left,
                        CONST.map.panPadding.top
                    ),
                    autoPanPaddingBottomRight: L.point(
                        CONST.map.panPadding.right,
                        CONST.map.panPadding.bottom
                    ),
                };
            }
            else {
                popupOptions = {
                    closeButton: false,
                    autoPanPadding: L.point(0, 0),
                };
            }

            const popup = L.popup( popupOptions ).setContent( popupContent );
            layer._popup = popup;
            layer.bindPopup( popup );
        }
    },

    bindAllPopups() {
        const rootLayers = this._getRootLayers();

        for (const i in rootLayers) {
            if ({}.hasOwnProperty.call(rootLayers, i)) {
                const rootLayer = rootLayers[i];
                const layers = rootLayer.getLayers();

                for (const layer of layers) {
                    if ( !layer._layerModel ) {
                        continue;
                    }

                    const content = this._buildLayerPopupContent(
                        layer,
                        layer._layerModel,
                        layer.feature
                    );

                    this._bindPopupTo(layer, content);
                }
            }
        }
    },

    unbindAllPopups() {
        const rootLayers = this._getRootLayers();

        for (const i in rootLayers) {
            if ({}.hasOwnProperty.call(rootLayers, i)) {
                const rootLayer = rootLayers[i];
                const layers = rootLayer.getLayers();

                for (const layer of layers) {
                    layer.closePopup().unbindPopup();
                }
            }
        }
    },

    _displayInfo(e) {
        const layer = e.target;
        const layerType = layer._layerModel.get('type');
        const isLogged = this._app.isLogged();
        const nonOsmData = this._nonOsmData.findWhere({
            themeFragment: this.model.get('fragment'),
            osmId: layer.feature.properties.id,
            osmType: layer.feature.properties.type,
        });
        const content = InfoDisplay.buildContent(
            layer._layerModel,
            layer.feature,
            nonOsmData ? nonOsmData.get('tags') : [],
            isLogged
        );
        const osmType = layer.feature.properties.type;
        const osmId = layer.feature.properties.id;
        const editRoute = `contribute/edit/${osmType}/${osmId}`;

        if ( !content ) {
            return false;
        }

        if ( !content && layerType !== CONST.layerType.overpass ) {
            return false;
        }

        if ( !content && !isLogged ) {
            return false;
        }

        switch (this.model.get('infoDisplay')) {
            case CONST.infoDisplay.modal:
                this._infoDisplayView = new InfoDisplayModalView({
                    layer,
                    layerModel: layer._layerModel,
                    content,
                    editRoute,
                    isLogged,
                }).open();
                break;

            case CONST.infoDisplay.column:
                this._infoDisplayView = new InfoDisplayColumnView({
                    layer,
                    layerModel: layer._layerModel,
                    content,
                    editRoute,
                    isLogged,
                }).open();
                break;
            default:
                return false;
        }

        return true;
    },

    _setRootLayer(layerModel, rootLayer) {
        this._rootLayers[layerModel.cid] = rootLayer;
    },

    _getRootLayer(layerModel) {
        return this._rootLayers[layerModel.cid];
    },

    _getRootLayers() {
        return this._rootLayers;
    },

    _removeRootLayer(layerModel) {
        if ( this._rootLayers[layerModel.cid] ) {
            delete this._rootLayers[layerModel.cid];
        }
    },

    _setOverPassLayer(layerModel, overPassLayer) {
        this._overPassLayers[layerModel.cid] = overPassLayer;
    },

    _getOverPassLayer(layerModel) {
        return this._overPassLayers[layerModel.cid];
    },

    _removeOverPassLayer(layerModel) {
        if ( this._overPassLayers[layerModel.cid] ) {
            delete this._overPassLayers[layerModel.cid];
        }
    },
});
