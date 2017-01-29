
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from 'const';
import Wreqr from 'backbone.wreqr';

import AboutModal from 'view/modal/about';

import UserColumn from 'view/user/userColumn';
import VisitorColumn from 'view/user/visitorColumn';
import UserThemesColumn from 'view/user/userThemesColumn';
import UserFavoriteThemesColumn from 'view/user/userFavoriteThemesColumn';


export default Backbone.Router.extend({
    routes: {
        user: 'routeUser',
        'my-themes': 'routeUserThemes',
        'my-favorite-themes': 'routeUserFavoriteThemes',

        about: 'routeAbout',
        logout: 'routeLogout',
    },

    initialize(app) {
        this._app = app;
        this._config = app.getConfig();
        this._user = app.getUser();
        this._radio = Wreqr.radio.channel('global');
        this._previousRoute = '';

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

    routeUser() {
        if ( this._app.isLogged() ) {
            new UserColumn({
                router: this,
                app: this._app,
            }).open();
        }
        else {
            new VisitorColumn({
                router: this,
                app: this._app,
            }).open();
        }
    },

    routeUserThemes() {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new UserThemesColumn({
            router: this,
            app: this._app,
            collection: this._app.getUserThemes(),
        }).open();
    },

    routeUserFavoriteThemes() {
        if (!this._userIsLogged()) {
            this.navigate('');
            return;
        }

        new UserFavoriteThemesColumn({
            router: this,
            app: this._app,
            collection: this._app.getUserFavoriteThemes().getCollection(),
        }).open();
    },

    routeAbout() {
        const version = this._app.getVersion();

        new AboutModal({
            routeOnClose: this._previousRoute,
            version,
        }).open();
    },
});
