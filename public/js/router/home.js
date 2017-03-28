
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';


export default Backbone.Router.extend({
    routes: {
        oups: 'routeOups',
    },

    initialize(app) {
        this._app = app;
        this._config = app.getConfig();
        this._user = app.getUser();
        this._radio = Wreqr.radio.channel('global');
        this._previousRoute = '';

        this.on('route', this._setPreviousRoute);
    },

    routeOups() {
    },
});
