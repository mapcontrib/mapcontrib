
import $ from 'jquery';
import Backbone from 'backbone';
import CONST from '../const';
import Wreqr from 'backbone.wreqr';
import ThemeRootView from '../view/themeRoot';


export default Backbone.Router.extend({
    routes: {
        '': 'routeDefault',
        'oups': 'routeDefault',

        'logout': 'routeLogout',
    },

    initialize: function (app) {
        this._app = app;
        this._radio = Wreqr.radio.channel('global');
    },

    routeDefault: function (){
        this._app.getRegion('root').show(
            new ThemeRootView( this._app )
        );
    },

    routeLogout: function (){
        $.ajax({
            type: 'GET',
            url: CONST.apiPath +'user/logout',
            dataType: 'json',
            context: this,
            complete: function () {
                this.navigate('');

                this._radio.vent.trigger('session:unlogged');
            }
        });
    },
});
