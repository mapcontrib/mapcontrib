
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import HomeRootView from '../view/homeRoot';


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
            new HomeRootView( this._app )
        );
    },
});
