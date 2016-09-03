
import 'babel-polyfill';
import './tools';
import 'jquery-form';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import '../lib/l20n.min.js';

import 'ionicons/css/ionicons.css';
import 'font-awesome-webpack';
import 'bootstrap-webpack';
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import 'bootstrap-filestyle';
import 'bootstrap-more/bootstrap-more.css';
import 'bootstrap-more/bootstrap-more.js';
import 'leaflet/dist/leaflet.css';

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

    initialize(window) {
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
        this._config = MAPCONTRIB.config;
        this._version = MAPCONTRIB.version;
        this._user = new UserModel(JSON.parse(unescape( MAPCONTRIB.user )));
        this._iDPresets = JSON.parse(unescape( MAPCONTRIB.iDPresets ));

        if (MAPCONTRIB.user) {
            this._user = new UserModel(JSON.parse(unescape( MAPCONTRIB.user )));
        }

        if (MAPCONTRIB.theme) {
            this._theme = new ThemeModel(JSON.parse(unescape( MAPCONTRIB.theme )));
        }

        if (MAPCONTRIB.nonOsmData) {
            this._nonOsmData = new NonOsmDataCollection(JSON.parse(unescape( MAPCONTRIB.nonOsmData )));
        }

        if (MAPCONTRIB.osmCache) {
            this._osmCache = new OsmCacheCollection(JSON.parse(unescape( MAPCONTRIB.osmCache )));
        }

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

    getWindow() {
        return this._window;
    },

    getDocument() {
        return this._window.document;
    },

    getUser() {
        return this._user;
    },

    getConfig() {
        return this._config;
    },

    getVersion() {
        return this._version;
    },

    getTheme() {
        return this._theme;
    },

    getNonOsmData() {
        return this._nonOsmData;
    },

    getOsmCache() {
        return this._osmCache;
    },

    getIDPresets() {
        return this._iDPresets;
    },

    isLogged() {
        return this._isLogged;
    },

    onStart(Router) {
        if ( this._user.get('_id') ) {
            this._radio.vent.trigger('session:logged');
        }

        this._router = new Router(this);

        this._radio.reqres.setHandler('router', () => this._router);

        Backbone.history.start();
    },
});
