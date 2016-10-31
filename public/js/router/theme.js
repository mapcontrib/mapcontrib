
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from 'const';
import Wreqr from 'backbone.wreqr';

import LayerModel from 'model/layer';
import TagModel from 'model/tag';
import PresetModel from 'model/preset';
import PresetCategoryModel from 'model/presetCategory';

import ThemeRootView from 'view/themeRoot';

import AboutModal from 'view/modal/about';

import SelectLayerColumn from 'view/select/layer/layerColumn';
import SelectTileColumn from 'view/select/tileColumn';

import InfoOverPassLayerColumn from 'view/info/layer/overPassColumn';
import InfoGpxLayerColumn from 'view/info/layer/gpxColumn';
import InfoCsvLayerColumn from 'view/info/layer/csvColumn';
import InfoGeoJsonLayerColumn from 'view/info/layer/geoJsonColumn';

import UserColumn from 'view/userColumn';
import VisitorColumn from 'view/visitorColumn';
import LinkColumn from 'view/linkColumn';

import TempLayerColumn from 'view/tempLayer/layerColumn';
import TempLayerAddMenuColumn from 'view/tempLayer/addMenuColumn';
import TempLayerEditOverPassColumn from 'view/tempLayer/editOverPassColumn';
import TempLayerEditGpxColumn from 'view/tempLayer/editGpxColumn';
import TempLayerEditCsvColumn from 'view/tempLayer/editCsvColumn';
import TempLayerEditGeoJsonColumn from 'view/tempLayer/editGeoJsonColumn';

import ContributeAddPositionContextual from 'view/contribute/add/positionContextual';
import ContributeAddPresetSelectionColumn from 'view/contribute/add/presetSelectionColumn';
import ContributeAddFormColumn from 'view/contribute/add/formColumn';

import ContributeEditPresetSelectionColumn from 'view/contribute/edit/presetSelectionColumn';
import ContributeEditFormColumn from 'view/contribute/edit/formColumn';

import AdminSettingMenuColumn from 'view/admin/setting/menuColumn';
import AdminSettingMainColumn from 'view/admin/setting/mainColumn';
import AdminSettingTileColumn from 'view/admin/setting/tileColumn';
import AdminSettingCacheArchiveColumn from 'view/admin/setting/cacheArchive/mainColumn';
import AdminSettingCacheArchiveSeeArchivesColumn from 'view/admin/setting/cacheArchive/archiveColumn';
import AdminSettingCacheArchiveDetailColumn from 'view/admin/setting/cacheArchive/detailColumn';

import AdminLayerColumn from 'view/admin/layer/layerColumn';
import AdminLayerAddMenuColumn from 'view/admin/layer/addMenuColumn';
import AdminLayerEditOverPassColumn from 'view/admin/layer/editOverPassColumn';
import AdminLayerEditGpxColumn from 'view/admin/layer/editGpxColumn';
import AdminLayerEditCsvColumn from 'view/admin/layer/editCsvColumn';
import AdminLayerEditGeoJsonColumn from 'view/admin/layer/editGeoJsonColumn';

import AdminTagColumn from 'view/admin/tag/tagColumn';
import AdminTagEditColumn from 'view/admin/tag/tagEditColumn';

import AdminPresetColumn from 'view/admin/preset/presetColumn';
import AdminPresetCategoryEditColumn from 'view/admin/preset/presetCategoryEditColumn';
import AdminPresetEditColumn from 'view/admin/preset/presetEditColumn';

import AdminLocaleLangMenuColumn from 'view/admin/locale/langMenuColumn';
import AdminLocaleItemMenuColumn from 'view/admin/locale/itemMenuColumn';
import AdminLocaleSettingColumn from 'view/admin/locale/settingColumn';
import AdminLocaleLayerColumn from 'view/admin/locale/layerColumn';
import AdminLocaleLayerEditColumn from 'view/admin/locale/layerEditColumn';
import AdminLocaleTagColumn from 'view/admin/locale/tagColumn';
import AdminLocaleTagEditColumn from 'view/admin/locale/tagEditColumn';
import AdminLocalePresetColumn from 'view/admin/locale/presetColumn';
import AdminLocalePresetEditColumn from 'view/admin/locale/presetEditColumn';
import AdminLocalePresetCategoryEditColumn from 'view/admin/locale/presetCategoryEditColumn';


export default Backbone.Router.extend({
    routes: {
        'position/:zoom/:lat/:lng': 'routeMapPosition',

        'select/layer': 'routeSelectLayer',
        'info/layer/:uuid': 'routeInfoLayer',
        'select/tile': 'routeSelectTile',

        user: 'routeUser',
        link: 'routeLink',

        'temp/layer': 'routeTempLayer',
        'temp/layer/new': 'routeTempLayerNew',
        'temp/layer/new/overpass': 'routeTempLayerNewOverPass',
        'temp/layer/new/gpx': 'routeTempLayerNewGpx',
        'temp/layer/new/csv': 'routeTempLayerNewCsv',
        'temp/layer/new/geojson': 'routeTempLayerNewGeoJson',
        'temp/layer/edit/:uuid': 'routeTempLayerEdit',

        'contribute/add': 'routeContributeAddPosition',
        'contribute/add/:lat/:lng': 'routeContributeAddPresetSelection',
        'contribute/add/:lat/:lng/no-preset': 'routeContributeAddNoPreset',
        'contribute/add/:lat/:lng/iD/*presetName': 'routeContributeAddIDPreset',
        'contribute/add/:lat/:lng/:uuid': 'routeContributeAddCustomPreset',

        'contribute/edit/:osmType/:osmId': 'routeContributeEditPresetSelection',
        'contribute/edit/:osmType/:osmId/no-preset': 'routeContributeEditNoPreset',
        'contribute/edit/:osmType/:osmId/iD/*presetName': 'routeContributeEditIDPreset',
        'contribute/edit/:osmType/:osmId/:uuid': 'routeContributeEditCustomPreset',

        'admin/setting': 'routeAdminSettingMenu',
        'admin/setting/main': 'routeAdminSettingMain',
        'admin/setting/tile': 'routeAdminSettingTile',
        'admin/setting/cache-archive': 'routeAdminSettingCacheArchive',
        'admin/setting/cache-archive/archives': 'routeAdminSettingCacheArchiveSeeArchives',
        'admin/setting/cache-archive/:layerUuid/*osmId': 'routeAdminSettingCacheArchiveDetail',

        'admin/layer': 'routeAdminLayer',
        'admin/layer/new': 'routeAdminLayerNew',
        'admin/layer/new/overpass': 'routeAdminLayerNewOverPass',
        'admin/layer/new/gpx': 'routeAdminLayerNewGpx',
        'admin/layer/new/csv': 'routeAdminLayerNewCsv',
        'admin/layer/new/geojson': 'routeAdminLayerNewGeoJson',
        'admin/layer/edit/:uuid': 'routeAdminLayerEdit',

        'admin/tag': 'routeAdminTag',
        'admin/tag/new': 'routeAdminTagNew',
        'admin/tag/edit/:uuid': 'routeAdminTagEdit',

        'admin/preset(/)(:categoryUuid)': 'routeAdminPreset',
        'admin/preset/new(/)(:parentUuid)': 'routeAdminPresetNew',
        'admin/preset/edit/:uuid': 'routeAdminPresetEdit',
        'admin/preset/category/new(/)(:parentUuid)': 'routeAdminPresetCategoryNew',
        'admin/preset/category/edit/:uuid': 'routeAdminPresetCategoryEdit',

        'admin/locale': 'routeAdminLocaleLangMenu',
        'admin/locale/:locale': 'routeAdminLocaleItemMenu',
        'admin/locale/:locale/theme': 'routeAdminLocaleSetting',
        'admin/locale/:locale/layer': 'routeAdminLocaleLayer',
        'admin/locale/:locale/layer/edit/:uuid': 'routeAdminLocaleLayerEdit',
        'admin/locale/:locale/tag': 'routeAdminLocaleTag',
        'admin/locale/:locale/tag/edit/:uuid': 'routeAdminLocaleTagEdit',
        'admin/locale/:locale/preset(/)(:categoryUuid)': 'routeAdminLocalePreset',
        'admin/locale/:locale/preset/edit/:uuid': 'routeAdminLocalePresetEdit',
        'admin/locale/:locale/preset/category/edit/:uuid': 'routeAdminLocalePresetCategoryEdit',

        about: 'routeAbout',
        logout: 'routeLogout',
        oups: 'routeOups',
    },

    initialize(app) {
        this._app = app;
        this._config = app.getConfig();
        this._theme = app.getTheme();
        this._user = app.getUser();
        this._iDPresetsHelper = app.getIDPresetsHelper();
        this._nonOsmData = this._app.getNonOsmData();
        this._osmCache = this._app.getOsmCache();
        this._tempLayerCollection = this._app.getTempLayerCollection();
        this._radio = Wreqr.radio.channel('global');
        this._previousRoute = '';

        this._app.getRegion('root').show(
            new ThemeRootView({ app: this._app })
        );

        this.on('route', this._setPreviousRoute);
    },

    _setPreviousRoute() {
        const url = window.location.href;
        const route = url.substring( url.indexOf('#') + 1 );
        this._previousRoute = route;
    },

    _userIsLogged() {
        return this._app.isLogged();
    },

    _userIsOwnerOfTheme() {
        return this._theme.isOwner(this._user);
    },

    routeOups() {
    },

    routeLogout() {
        $.ajax({
            type: 'GET',
            url: `${CONST.apiPath}/user/logout`,
            dataType: 'json',
            context: this,
            complete: () => {
                this.navigate('');

                this._radio.vent.trigger('session:unlogged');
            },
        });
    },

    routeMapPosition(zoom, lat, lng) {
        this._radio.commands.execute('map:position', zoom, lat, lng);
        this.navigate('');
    },

    routeSelectLayer() {
        new SelectLayerColumn({
            router: this,
            model: this._theme,
            collection: this._theme.get('layers'),
        }).open();
    },

    routeInfoLayer(uuid) {
        const model = this._theme.get('layers').findWhere({ uuid });

        if (model) {
            let InfoLayerColumn;
            switch (model.get('type')) {
                case CONST.layerType.overpass:
                    InfoLayerColumn = InfoOverPassLayerColumn;
                    break;
                case CONST.layerType.gpx:
                    InfoLayerColumn = InfoGpxLayerColumn;
                    break;
                case CONST.layerType.csv:
                    InfoLayerColumn = InfoCsvLayerColumn;
                    break;
                case CONST.layerType.geojson:
                    InfoLayerColumn = InfoGeoJsonLayerColumn;
                    break;
                default:
                    this.navigate('admin/layer', true);
                    return;
            }

            new InfoLayerColumn({
                router: this,
                theme: this._theme,
                model,
            }).open();
        }
        else {
            this.navigate('', true);
        }
    },

    routeSelectTile() {
        new SelectTileColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeUser() {
        if ( this._app.isLogged() ) {
            new UserColumn({
                router: this,
                model: this._theme,
            }).open();
        }
        else {
            new VisitorColumn({
                router: this,
                model: this._theme,
            }).open();
        }
    },

    routeAbout() {
        const version = this._app.getVersion();

        new AboutModal({
            routeOnClose: this._previousRoute,
            version,
        }).open();
    },

    routeLink() {
        new LinkColumn({
            router: this,
            model: this._theme,
        }).open();
    },


    routeTempLayer() {
        new TempLayerColumn({
            router: this,
            collection: this._tempLayerCollection,
            model: this._theme,
        }).open();
    },

    routeTempLayerNew() {
        new TempLayerAddMenuColumn({
            router: this,
            model: this._theme,
            routeOnClose: 'temp/layer',
            triggerRouteOnClose: true,
        }).open();
    },

    routeTempLayerNewOverPass() {
        new TempLayerEditOverPassColumn({
            router: this,
            theme: this._theme,
            collection: this._tempLayerCollection,
            model: new LayerModel({
                type: CONST.layerType.overpass,
            }),
            routeOnClose: 'temp/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeTempLayerNewGpx() {
        new TempLayerEditGpxColumn({
            router: this,
            theme: this._theme,
            collection: this._tempLayerCollection,
            model: new LayerModel({
                type: CONST.layerType.gpx,
            }),
            routeOnClose: 'temp/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeTempLayerNewCsv() {
        new TempLayerEditCsvColumn({
            router: this,
            theme: this._theme,
            collection: this._tempLayerCollection,
            model: new LayerModel({
                type: CONST.layerType.csv,
            }),
            routeOnClose: 'temp/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeTempLayerNewGeoJson() {
        new TempLayerEditGeoJsonColumn({
            router: this,
            theme: this._theme,
            collection: this._tempLayerCollection,
            model: new LayerModel({
                type: CONST.layerType.geojson,
            }),
            routeOnClose: 'temp/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeTempLayerEdit(uuid) {
        const model = this._tempLayerCollection.findWhere({ uuid });

        if (model) {
            let TempLayerEditColumn;
            switch (model.get('type')) {
                case CONST.layerType.overpass:
                    TempLayerEditColumn = TempLayerEditOverPassColumn;
                    break;
                case CONST.layerType.gpx:
                    TempLayerEditColumn = TempLayerEditGpxColumn;
                    break;
                case CONST.layerType.csv:
                    TempLayerEditColumn = TempLayerEditCsvColumn;
                    break;
                case CONST.layerType.geojson:
                    TempLayerEditColumn = TempLayerEditGeoJsonColumn;
                    break;
                default:
                    this.navigate('temp/layer', true);
                    return;
            }

            new TempLayerEditColumn({
                router: this,
                theme: this._theme,
                collection: this._tempLayerCollection,
                model,
                routeOnClose: 'temp/layer',
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate('temp/layer', true);
        }
    },


    routeContributeAddPosition() {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new ContributeAddPositionContextual({
            router: this,
            model: this._theme,
        }).open();
    },

    routeContributeAddPresetSelection(lat, lng) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new ContributeAddPresetSelectionColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            center: { lat, lng },
            iDPresetsHelper: this._iDPresetsHelper,
        }).open();
    },

    routeContributeAddNoPreset(lat, lng) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new ContributeAddFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            center: { lat, lng },
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
        }).open();
    },

    routeContributeAddIDPreset(lat, lng, presetName) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new ContributeAddFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            center: { lat, lng },
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
            presetType: 'iD',
            preset: presetName,
        }).open();
    },

    routeContributeAddCustomPreset(lat, lng, uuid) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new ContributeAddFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            center: { lat, lng },
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
            presetType: 'custom',
            preset: this._theme.get('presets').findWhere({ uuid }),
        }).open();
    },


    routeContributeEditPresetSelection(osmType, osmId) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        const editionData = this._radio.reqres.request('edition-data');

        if (!editionData) {
            this.navigate('');
            return;
        }

        new ContributeEditPresetSelectionColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            osmId: parseInt(osmId, 10),
            osmType,
            iDPresetsHelper: this._iDPresetsHelper,
        }).open();
    },

    routeContributeEditNoPreset(osmType, osmId) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        const editionData = this._radio.reqres.request('edition-data');

        if (!editionData) {
            this.navigate('');
            return;
        }

        new ContributeEditFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            osmId: parseInt(osmId, 10),
            osmType,
            layer: editionData.layer,
            layerModel: editionData.layerModel,
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
        }).open();
    },

    routeContributeEditIDPreset(osmType, osmId, presetName) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        const editionData = this._radio.reqres.request('edition-data');

        if (!editionData) {
            this.navigate('');
            return;
        }

        new ContributeEditFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            osmId: parseInt(osmId, 10),
            osmType,
            layer: editionData.layer,
            layerModel: editionData.layerModel,
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
            presetType: 'iD',
            preset: presetName,
        }).open();
    },

    routeContributeEditCustomPreset(osmType, osmId, uuid) {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        const editionData = this._radio.reqres.request('edition-data');

        if (!editionData) {
            this.navigate('');
            return;
        }

        new ContributeEditFormColumn({
            router: this,
            config: this._config,
            theme: this._theme,
            user: this._user,
            osmId: parseInt(osmId, 10),
            osmType,
            layer: editionData.layer,
            layerModel: editionData.layerModel,
            iDPresetsHelper: this._iDPresetsHelper,
            nonOsmData: this._nonOsmData,
            osmCache: this._osmCache,
            presetType: 'custom',
            preset: this._theme.get('presets').findWhere({ uuid }),
        }).open();
    },


    routeAdminSettingMenu() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingMenuColumn({
            router: this,
            model: this._theme,
            config: this._config,
        }).open();
    },

    routeAdminSettingMain() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingMainColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminSettingTile() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingTileColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminSettingCacheArchive() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingCacheArchiveColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminSettingCacheArchiveSeeArchives() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingCacheArchiveSeeArchivesColumn({
            router: this,
            model: this._theme,
            routeOnClose: 'admin/setting/cache-archive',
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminSettingCacheArchiveDetail(layerUuid, osmId) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const layerModel = this._theme.get('layers').findWhere({
            uuid: layerUuid,
        });

        if (!layerModel) {
            this.navigate('');
            return;
        }

        const features = layerModel.get('cacheDeletedFeatures').filter(
            feature => feature.id === osmId
        );

        if (features.length === 0) {
            this.navigate('');
            return;
        }

        new AdminSettingCacheArchiveDetailColumn({
            router: this,
            theme: this._theme,
            model: layerModel,
            deletedFeature: features[0],
            routeOnClose: this._previousRoute,
            triggerRouteOnClose: true,
        }).open();
    },


    routeAdminLayer() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminLayerNew() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerAddMenuColumn({
            router: this,
            model: this._theme,
            routeOnClose: 'admin/layer',
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLayerNewOverPass() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerEditOverPassColumn({
            router: this,
            theme: this._theme,
            model: new LayerModel({
                type: CONST.layerType.overpass,
            }),
            routeOnClose: 'admin/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminLayerNewGpx() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerEditGpxColumn({
            router: this,
            theme: this._theme,
            model: new LayerModel({
                type: CONST.layerType.gpx,
            }),
            routeOnClose: 'admin/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminLayerNewCsv() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerEditCsvColumn({
            router: this,
            theme: this._theme,
            model: new LayerModel({
                type: CONST.layerType.csv,
            }),
            routeOnClose: 'admin/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminLayerNewGeoJson() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLayerEditGeoJsonColumn({
            router: this,
            theme: this._theme,
            model: new LayerModel({
                type: CONST.layerType.geojson,
            }),
            routeOnClose: 'admin/layer',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminLayerEdit(uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('layers').findWhere({ uuid });

        if (model) {
            let AdminLayerEditColumn;
            switch (model.get('type')) {
                case CONST.layerType.overpass:
                    AdminLayerEditColumn = AdminLayerEditOverPassColumn;
                    break;
                case CONST.layerType.gpx:
                    AdminLayerEditColumn = AdminLayerEditGpxColumn;
                    break;
                case CONST.layerType.csv:
                    AdminLayerEditColumn = AdminLayerEditCsvColumn;
                    break;
                case CONST.layerType.geojson:
                    AdminLayerEditColumn = AdminLayerEditGeoJsonColumn;
                    break;
                default:
                    this.navigate('admin/layer', true);
                    return;
            }

            new AdminLayerEditColumn({
                router: this,
                theme: this._theme,
                model,
                routeOnClose: 'admin/layer',
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate('admin/layer', true);
        }
    },


    routeAdminTag() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminTagColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminTagNew() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminTagEditColumn({
            router: this,
            theme: this._theme,
            model: new TagModel(),
            routeOnClose: 'admin/tag',
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminTagEdit(uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('tags').findWhere({ uuid });

        if (model) {
            new AdminTagEditColumn({
                router: this,
                theme: this._theme,
                model,
                routeOnClose: 'admin/tag',
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate('admin/tag', true);
        }
    },


    routeAdminPreset(categoryUuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presetCategories')
        .findWhere({ uuid: categoryUuid || undefined });

        new AdminPresetColumn({
            router: this,
            theme: this._theme,
            model,
        }).open();
    },

    routeAdminPresetNew(parentUuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminPresetEditColumn({
            router: this,
            theme: this._theme,
            model: new PresetModel({
                parentUuid: parentUuid || undefined,
            }),
            iDPresetsHelper: this._iDPresetsHelper,
            routeOnClose: this._previousRoute,
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminPresetEdit(uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presets').findWhere({ uuid });

        if (model) {
            new AdminPresetEditColumn({
                router: this,
                theme: this._theme,
                model,
                iDPresetsHelper: this._iDPresetsHelper,
                routeOnClose: this._previousRoute,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate('admin/preset', true);
        }
    },

    routeAdminPresetCategoryNew(parentUuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminPresetCategoryEditColumn({
            router: this,
            theme: this._theme,
            model: new PresetCategoryModel({
                parentUuid: parentUuid || undefined,
            }),
            routeOnClose: this._previousRoute,
            triggerRouteOnClose: true,
            isNew: true,
        }).open();
    },

    routeAdminPresetCategoryEdit(uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presetCategories').findWhere({ uuid });

        if (model) {
            new AdminPresetCategoryEditColumn({
                router: this,
                theme: this._theme,
                model,
                routeOnClose: this._previousRoute,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate('admin/preset', true);
        }
    },


    routeAdminLocaleLangMenu() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLocaleLangMenuColumn({
            router: this,
            theme: this._theme,
        }).open();
    },

    routeAdminLocaleItemMenu(locale) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLocaleItemMenuColumn({
            router: this,
            theme: this._theme,
            locale,
            routeOnClose: 'admin/locale',
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLocaleSetting(locale) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLocaleSettingColumn({
            router: this,
            model: this._theme,
            locale,
            routeOnClose: `admin/locale/${locale}`,
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLocaleLayer(locale) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLocaleLayerColumn({
            router: this,
            model: this._theme,
            locale,
            routeOnClose: `admin/locale/${locale}`,
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLocaleLayerEdit(locale, uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('layers').findWhere({ uuid });

        if (model) {
            new AdminLocaleLayerEditColumn({
                router: this,
                theme: this._theme,
                locale,
                model,
                routeOnClose: `admin/locale/${locale}/layer`,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate(`admin/locale/${locale}/layer`, true);
        }
    },

    routeAdminLocaleTag(locale) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminLocaleTagColumn({
            router: this,
            model: this._theme,
            locale,
            routeOnClose: `admin/locale/${locale}`,
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLocaleTagEdit(locale, uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('tags').findWhere({ uuid });

        if (model) {
            new AdminLocaleTagEditColumn({
                router: this,
                theme: this._theme,
                locale,
                model,
                routeOnClose: `admin/locale/${locale}/tag`,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate(`admin/locale/${locale}/tag`, true);
        }
    },

    routeAdminLocalePreset(locale, categoryUuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presetCategories')
        .findWhere({ uuid: categoryUuid || undefined });

        new AdminLocalePresetColumn({
            router: this,
            theme: this._theme,
            model,
            locale,
            routeOnClose: `admin/locale/${locale}`,
            triggerRouteOnClose: true,
        }).open();
    },

    routeAdminLocalePresetEdit(locale, uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presets').findWhere({ uuid });

        if (model) {
            new AdminLocalePresetEditColumn({
                router: this,
                theme: this._theme,
                locale,
                model,
                routeOnClose: this._previousRoute,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate(`admin/locale/${locale}/preset`, true);
        }
    },

    routeAdminLocalePresetCategoryEdit(locale, uuid) {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        const model = this._theme.get('presetCategories').findWhere({ uuid });

        if (model) {
            new AdminLocalePresetCategoryEditColumn({
                router: this,
                theme: this._theme,
                locale,
                model,
                routeOnClose: this._previousRoute,
                triggerRouteOnClose: true,
            }).open();
        }
        else {
            this.navigate(`admin/locale/${locale}/preset`, true);
        }
    },
});
