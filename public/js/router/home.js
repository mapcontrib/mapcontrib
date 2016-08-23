
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import HomeRootView from '../view/homeRoot';


export default Backbone.Router.extend({
    routes: {
        '': 'routeDefault',
        'oups': 'routeDefault',

        'logout': 'routeLogout',
    },

    initialize(app) {
        this._app = app;
        this._radio = Wreqr.radio.channel('global');
    },

    routeDefault(){
        this._app.getRegion('root').show(
            new HomeRootView({'app': this._app})
        );
    },
});
