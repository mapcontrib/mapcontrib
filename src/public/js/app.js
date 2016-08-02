
import 'babel-polyfill';
import tools from './tools';
import jqueryForm from 'jquery-form';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L20n from '../lib/l20n.min.js';

import ionicons from 'ionicons/css/ionicons.css';
import fontAwesome from 'font-awesome-webpack';
import bootstrap from 'bootstrap-webpack';
import awesomeBootstrapCheckbox from 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import BootstrapFileStyle from 'bootstrap-filestyle';
import bootstrapMoreCss from 'bootstrap-more/bootstrap-more.css';
import bootstrapMoreJs from 'bootstrap-more/bootstrap-more.js';
import leafletCss from 'leaflet/dist/leaflet.css';

import UserModel from './model/user';
import ThemeModel from './model/theme';
import NonOsmDataCollection from './collection/nonOsmData';
import OsmCacheCollection from './collection/osmCache';
import L20nBehavior from './behavior/l20n';
import ColumnBehavior from './behavior/column';
import ModalBehavior from './behavior/modal';
import NotificationBehavior from './behavior/notification';
import ContextualBehavior from './behavior/contextual';
import WidgetBehavior from './behavior/widget';



export default Marionette.Application.extend({
    regions: {
        'root': '#rg_root',
    },

    initialize: function(window) {
        window.document.l10n.addEventListener('error', (err) => {
            console.error(`L20n: ${err}`);
        });

        window.document.l10n.addEventListener('warning', (err) => {
            console.warn(`L20n: ${err}`);
        });

        Marionette.Behaviors.behaviorsLookup = () => {
            return {
                'l20n': L20nBehavior,
                'column': ColumnBehavior,
                'modal': ModalBehavior,
                'notification': NotificationBehavior,
                'contextual': ContextualBehavior,
                'widget': WidgetBehavior,
            };
        };


        this._isLogged = false;
        this._window = window;
        this._user = new UserModel( MAPCONTRIB.user );
        this._config = MAPCONTRIB.config;
        this._version = MAPCONTRIB.version;
        this._theme = new ThemeModel( MAPCONTRIB.theme );
        this._nonOsmData = new NonOsmDataCollection( MAPCONTRIB.nonOsmData );
        this._osmCache = new OsmCacheCollection( MAPCONTRIB.osmCache );
        this._radio = Wreqr.radio.channel('global');


        this._radio.vent.on('session:logged', () => {
            this._isLogged = true;
            window.document.body.classList.add('user_logged');
        });

        this._radio.vent.on('session:unlogged', () => {
            this._isLogged = false;
            window.document.body.classList.remove('user_logged');
            this._user = new UserModel();
        });
    },

    getWindow: function () {
        return this._window;
    },

    getDocument: function () {
        return this._window.document;
    },

    getUser: function () {
        return this._user;
    },

    getConfig: function () {
        return this._config;
    },

    getVersion: function () {
        return this._version;
    },

    getTheme: function () {
        return this._theme;
    },

    getNonOsmData: function () {
        return this._nonOsmData;
    },

    getOsmCache: function () {
        return this._osmCache;
    },

    isLogged: function () {
        return this._isLogged;
    },

    onStart: function (Router) {
        if ( this._user.get('_id') ) {
            this._radio.vent.trigger('session:logged');
        }

        this._router = new Router(this);

        this._radio.reqres.setHandler('router', () => this._router);

        Backbone.history.start();
    },
});
