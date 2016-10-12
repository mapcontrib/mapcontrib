
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from 'const';
import Wreqr from 'backbone.wreqr';

import PresetModel from 'model/preset';
import PresetCategoryModel from 'model/presetCategory';
import TagModel from 'model/tag';

import ThemeRootView from 'view/themeRoot';

import AboutModal from 'view/modal/about';

import SelectLayerColumn from 'view/select/layer/layerColumn';
import SelectTileColumn from 'view/select/tileColumn';

import UserColumn from 'view/userColumn';
import VisitorColumn from 'view/visitorColumn';
import LinkColumn from 'view/linkColumn';

import ContributeAddPositionContextual from 'view/contribute/add/positionContextual';
import ContributeAddPresetSelectionColumn from 'view/contribute/add/presetSelectionColumn';
import ContributeAddFormColumn from 'view/contribute/add/formColumn';

import ContributeEditPresetSelectionColumn from 'view/contribute/edit/presetSelectionColumn';
import ContributeEditFormColumn from 'view/contribute/edit/formColumn';

import AdminSettingMenuColumn from 'view/admin/setting/menuColumn';
import AdminSettingMainColumn from 'view/admin/setting/mainColumn';
import AdminSettingTileColumn from 'view/admin/setting/tileColumn';
import AdminPresetColumn from 'view/admin/preset/presetColumn';
import AdminPresetCategoryEditColumn from 'view/admin/preset/presetCategoryEditColumn';
import AdminPresetEditColumn from 'view/admin/preset/presetEditColumn';
import AdminTagColumn from 'view/admin/tag/tagColumn';
import AdminTagEditColumn from 'view/admin/tag/tagEditColumn';


export default Backbone.Router.extend({
    routes: {
        'position/:zoom/:lat/:lng': 'routeMapPosition',

        'select/layer': 'routeSelectLayer',
        'select/tile': 'routeSelectTile',

        user: 'routeUser',
        link: 'routeLink',

        'contribute/add': 'routeContributeAddPosition',
        'contribute/add/:lat/:lng': 'routeContributeAddPresetSelection',
        'contribute/add/:lat/:lng/no-preset': 'routeContributeAddNoPreset',
        'contribute/add/:lat/:lng/iD/*presetName': 'routeContributeAddIDPreset',
        'contribute/add/:lat/:lng/:uuid': 'routeContributeAddCustomPreset',

        'contribute/edit/:osmType/:osmId': 'routeContributeEditPresetSelection',
        'contribute/edit/:osmType/:osmId/no-preset': 'routeContributeEditNoPreset',
        'contribute/edit/:osmType/:osmId/iD/*presetName': 'routeContributeEditIDPreset',
        'contribute/edit/:osmType/:osmId/:uuid': 'routeContributeEditCustomPreset',

        'admin/setting': 'routeAdminSetting',
        'admin/setting/main': 'routeAdminSettingMain',
        'admin/setting/tile': 'routeAdminSettingTile',

        'admin/preset(/)(:categoryUuid)': 'routeAdminPreset',
        'admin/preset/new(/)(:parentUuid)': 'routeAdminPresetNew',
        'admin/preset/edit/:uuid': 'routeAdminPresetEdit',
        'admin/preset/category/new(/)(:parentUuid)': 'routeAdminPresetCategoryNew',
        'admin/preset/category/edit/:uuid': 'routeAdminPresetCategoryEdit',

        'admin/tag': 'routeAdminTag',
        'admin/tag/new': 'routeAdminTagNew',
        'admin/tag/edit/:uuid': 'routeAdminTagEdit',

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
            preset: this._theme.get('presets').findWhere({ uuid }),
        }).open();
    },


    routeAdminSetting() {
        if (!this._userIsOwnerOfTheme()) {
            this.navigate('');
            return;
        }

        new AdminSettingMenuColumn({
            router: this,
            model: this._theme,
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
});
