
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import CONST from 'const';

import HomeRootView from 'view/homeRoot';
import UserColumn from 'view/userColumn';
import VisitorColumn from 'view/visitorColumn';
import AboutModal from 'view/modal/about';


export default Backbone.Router.extend({
    routes: {
        user: 'routeUser',

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
            new HomeRootView({ app: this._app })
        );

        this.on('route', this._setPreviousRoute);
    },

    routeOups() {
    },

    routeAbout() {
        const version = this._app.getVersion();

        new AboutModal({
            routeOnClose: this._previousRoute,
            version,
        }).open();
    },

    routeUser() {
        if ( this._app.isLogged() ) {
            new UserColumn({
                router: this,
                app: this._app,
                model: this._theme,
            }).open();
        }
        else {
            new VisitorColumn({
                router: this,
                app: this._app,
                model: this._theme,
            }).open();
        }
    },

    routeLogout() {
        $.ajax({
            type: 'GET',
            url: `${CONST.apiPath}/user/logout`,
            dataType: 'json',
            context: this,
            cache: false,
            complete: () => {
                this.navigate('');

                this._radio.vent.trigger('session:unlogged');
            },
        });
    },
});
