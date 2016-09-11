
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from 'const';
import Wreqr from 'backbone.wreqr';

import PresetModel from 'model/preset';
import TagModel from 'model/tag';

import ThemeRootView from 'view/themeRoot';

import AboutModal from 'view/modal/about';

import SelectLayerColumn from 'view/select/layer/layerColumn';
import SelectTileColumn from 'view/select/tileColumn';

import UserColumn from 'view/userColumn';
import VisitorColumn from 'view/visitorColumn';
import LinkColumn from 'view/linkColumn';

import AdminSettingColumn from 'view/admin/settingColumn';
import AdminTileColumn from 'view/admin/tileColumn';
import AdminPresetColumn from 'view/admin/preset/presetColumn';
import AdminPresetEditColumn from 'view/admin/preset/presetEditColumn';
import AdminTagColumn from 'view/admin/tag/tagColumn';
import AdminTagEditColumn from 'view/admin/tag/tagEditColumn';


export default Backbone.Router.extend({
    routes: {
        'position/:zoom/:lat/:lng': 'routeMapPosition',

        'select/layer': 'routeSelectLayer',
        'select/tile': 'routeSelectTile',

        'user': 'routeUser',
        'link': 'routeLink',

        'admin/setting': 'routeAdminSetting',
        'admin/tile': 'routeAdminTile',

        'admin/preset': 'routeAdminPreset',
        'admin/preset/new': 'routeAdminPresetNew',
        'admin/preset/:uuid': 'routeAdminPresetEdit',

        'admin/tag': 'routeAdminTag',
        'admin/tag/new': 'routeAdminTagNew',
        'admin/tag/:uuid': 'routeAdminTagEdit',

        'about': 'routeAbout',
        'logout': 'routeLogout',
        'oups': 'routeOups',
    },

    initialize(app) {
        this._app = app;
        this._theme = app.getTheme();
        this._radio = Wreqr.radio.channel('global');
        this._previousRoute = '';

        this._app.getRegion('root').show(
            new ThemeRootView({'app': this._app})
        );

        this.on('route', this._setPreviousRoute);
    },

    _setPreviousRoute() {
        const url = window.location.href;
        const route = url.substring( url.indexOf('#') + 1 );
        this._previousRoute = route;
    },

    routeOups() {
    },

    routeLogout() {
        $.ajax({
            type: 'GET',
            url: CONST.apiPath +'user/logout',
            dataType: 'json',
            context: this,
            complete: () => {
                this.navigate('');

                this._radio.vent.trigger('session:unlogged');
            }
        });
    },

    routeMapPosition(zoom, lat, lng){
        const version = this._radio.commands.execute('map:position', zoom, lat, lng);
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
            previousRoute: this._previousRoute,
            version,
        }).open();
    },

    routeLink() {
        new LinkColumn({
            router: this,
            model: this._theme,
        }).open();
    },


    routeAdminSetting() {
        new AdminSettingColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminTile() {
        new AdminTileColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminPreset() {
        new AdminPresetColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminPresetNew() {
        new AdminPresetEditColumn({
            router: this,
            theme: this._theme,
            model: new PresetModel(),
            isNew: true,
        }).open();
    },

    routeAdminPresetEdit(uuid) {
        const model = this._theme.get('presets').findWhere({ uniqid: uuid });

        if (model) {
            new AdminPresetEditColumn({
                router: this,
                theme: this._theme,
                model,
            }).open();
        }
        else {
            this.navigate('');
        }
    },


    routeAdminTag() {
        new AdminTagColumn({
            router: this,
            model: this._theme,
        }).open();
    },

    routeAdminTagNew() {
        new AdminTagEditColumn({
            router: this,
            theme: this._theme,
            model: new TagModel(),
            isNew: true,
        }).open();
    },

    routeAdminTagEdit(uuid) {
        const model = this._theme.get('tags').findWhere({ uniqid: uuid });

        if (model) {
            new AdminTagEditColumn({
                router: this,
                theme: this._theme,
                model,
            }).open();
        }
        else {
            this.navigate('');
        }
    },
});
