
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from '../const';
import Wreqr from 'backbone.wreqr';
import ThemeRootView from '../view/themeRoot';
import AboutView from '../view/aboutModal';


export default Backbone.Router.extend({
    routes: {
        'position/:zoom/:lat/:lng': 'routeMapPosition',
        'about': 'routeAbout',
        'logout': 'routeLogout',
        'oups': 'routeOups',
    },

    initialize(app) {
        this._app = app;
        this._radio = Wreqr.radio.channel('global');
        this._previousRoute = '';

        this._app.getRegion('root').show(
            new ThemeRootView({'app': this._app})
        );

        if (window.addEventListener) {
            window.addEventListener('popstate', () => this._setPreviousRoute, false);
        }
        else {
            window.attachEvent('onpopstate', () => this._setPreviousRoute);
        }
    },

    _setPreviousRoute() {
        const url = window.location.href;
        const route = url.substring( url.indexOf('#') + 1 );
        this._previousRoute = route;
    },

    routeOups(){
    },

    routeLogout(){
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

    routeAbout(){
        const version = this._app.getVersion();

        new AboutView({
            'previousRoute': this._previousRoute,
            version,
        }).open();
    },

    routeMapPosition(zoom, lat, lng){
        const version = this._radio.commands.execute('map:position', zoom, lat, lng);
        this.navigate('');
    },
});
